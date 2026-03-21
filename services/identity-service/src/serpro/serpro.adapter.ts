import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import Redis from 'ioredis';

export interface SerproCpfResult {
  ni: string;
  nome: string;
  situacao: {
    codigo: string;
    descricao: string;
  };
  nascimento: string;
}

export interface SerproCnpjResult {
  ni: string;
  razaoSocial: string;
  situacaoCadastral: {
    codigo: string;
    descricao: string;
  };
}

@Injectable()
export class SerproAdapter {
  private readonly logger = new Logger(SerproAdapter.name);
  private readonly httpClient: AxiosInstance;
  private readonly redis: Redis;
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokenUrl: string;
  private readonly cacheTtl: number;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor() {
    this.baseUrl =
      process.env.SERPRO_BASE_URL ||
      'https://gateway.apiserpro.serpro.gov.br';
    this.clientId = process.env.SERPRO_CLIENT_ID || '';
    this.clientSecret = process.env.SERPRO_CLIENT_SECRET || '';
    this.tokenUrl =
      process.env.SERPRO_TOKEN_URL ||
      'https://gateway.apiserpro.serpro.gov.br/token';
    this.cacheTtl = parseInt(
      process.env.SERPRO_CACHE_TTL_SECONDS || '86400',
      10,
    );
    this.timeout = parseInt(process.env.SERPRO_TIMEOUT_MS || '5000', 10);
    this.maxRetries = parseInt(process.env.SERPRO_MAX_RETRIES || '2', 10);

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
      keyPrefix: 'serpro:',
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });

    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis connection failed for Serpro cache: ${err.message}. Proceeding without cache.`);
    });
  }

  async validateCpf(cpf: string): Promise<SerproCpfResult> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const cacheKey = `cpf:${cleanCpf}`;

    const cached = await this.getFromCache<SerproCpfResult>(cacheKey);
    if (cached) {
      this.logger.debug(`CPF validation cache hit: ${cleanCpf.substring(0, 3)}***`);
      return cached;
    }

    const result = await this.executeWithRetry<SerproCpfResult>(async () => {
      const token = await this.getAccessToken();
      const response = await this.httpClient.get(
        `/consulta-cpf-df/v1/cpf/${cleanCpf}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    });

    await this.setInCache(cacheKey, result, this.cacheTtl);
    return result;
  }

  async validateCnpj(cnpj: string): Promise<SerproCnpjResult> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const cacheKey = `cnpj:${cleanCnpj}`;

    const cached = await this.getFromCache<SerproCnpjResult>(cacheKey);
    if (cached) {
      this.logger.debug(`CNPJ validation cache hit: ${cleanCnpj.substring(0, 4)}***`);
      return cached;
    }

    const result = await this.executeWithRetry<SerproCnpjResult>(async () => {
      const token = await this.getAccessToken();
      const response = await this.httpClient.get(
        `/consulta-cnpj-df/v1/cnpj/${cleanCnpj}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    });

    await this.setInCache(cacheKey, result, this.cacheTtl);
    return result;
  }

  private async getAccessToken(): Promise<string> {
    const tokenCacheKey = 'oauth:token';

    const cachedToken = await this.getFromCache<string>(tokenCacheKey);
    if (cachedToken) {
      return cachedToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Serpro client credentials not configured');
    }

    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const response = await this.httpClient.post(
      this.tokenUrl,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        baseURL: '',
      },
    );

    const { access_token, expires_in } = response.data;
    const ttl = (expires_in || 3600) - 60;

    await this.setInCache(tokenCacheKey, access_token, ttl);
    return access_token;
  }

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Serpro API attempt ${attempt + 1}/${this.maxRetries + 1} failed: ${lastError.message}`,
        );

        if (attempt < this.maxRetries) {
          const backoff = Math.pow(2, attempt) * 500;
          await new Promise((resolve) => setTimeout(resolve, backoff));
        }
      }
    }

    throw lastError;
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      this.logger.warn(`Redis cache read failed: ${(error as Error).message}`);
      return null;
    }
  }

  private async setInCache(
    key: string,
    value: any,
    ttlSeconds: number,
  ): Promise<void> {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      this.logger.warn(`Redis cache write failed: ${(error as Error).message}`);
    }
  }
}
