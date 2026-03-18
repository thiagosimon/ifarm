import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import Redis from 'ioredis';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { isPublicRoute } from '../config/routes.config';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';

interface KeycloakTokenPayload {
  sub: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
  tenant_id?: string;
  preferred_username?: string;
  email?: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

const REDIS_KEY_PREFIX = 'jwks:key:';
const REDIS_KEY_TTL = 3600; // 1 hour in seconds

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly jwksClient: jwksRsa.JwksClient;
  private readonly redis: Redis;
  private readonly issuerUrl: string;

  constructor(private readonly reflector: Reflector) {
    const jwksUri =
      process.env.KEYCLOAK_JWKS_URI ||
      'http://localhost:8080/realms/ifarm/protocol/openid-connect/certs';

    this.issuerUrl =
      process.env.KEYCLOAK_ISSUER_URL || 'http://localhost:8080/realms/ifarm';

    this.jwksClient = jwksRsa({
      jwksUri,
      cache: true,
      cacheMaxAge: REDIS_KEY_TTL * 1000,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times: number) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });

    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis connection failed for JWT cache: ${err.message}`);
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if the route is decorated with @Public()
    const isPublicDecorator = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicDecorator) {
      return true;
    }

    // Check if the route matches a public route pattern
    if (isPublicRoute(request.method, request.path)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const payload = await this.verifyToken(token);

      // Inject user context headers for downstream services
      const userId = payload.sub;
      const roles = this.extractRoles(payload);
      const tenantId = payload.tenant_id || 'default';
      const correlationId =
        (request.headers[CORRELATION_ID_HEADER] as string) || '';

      request.headers['x-user-id'] = userId;
      request.headers['x-user-role'] = roles.join(',');
      request.headers['x-tenant-id'] = tenantId;
      request.headers['x-correlation-id'] = correlationId;

      // Attach user info to request for downstream use
      (request as any).user = {
        id: userId,
        roles,
        tenantId,
        email: payload.email,
        username: payload.preferred_username,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Token verification failed: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  private async verifyToken(token: string): Promise<KeycloakTokenPayload> {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token format');
    }

    const kid = decoded.header.kid;
    const signingKey = await this.getSigningKey(kid);

    const payload = jwt.verify(token, signingKey, {
      issuer: this.issuerUrl,
      algorithms: ['RS256'],
    }) as KeycloakTokenPayload;

    return payload;
  }

  private async getSigningKey(kid: string): Promise<string> {
    // Try to get from Redis cache first
    try {
      const cachedKey = await this.redis.get(`${REDIS_KEY_PREFIX}${kid}`);
      if (cachedKey) {
        this.logger.debug(`JWKS key cache hit for kid: ${kid}`);
        return cachedKey;
      }
    } catch (err) {
      this.logger.warn(`Redis read failed, falling back to JWKS client: ${(err as Error).message}`);
    }

    // Fetch from JWKS endpoint
    const key = await this.jwksClient.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    // Cache in Redis for 1 hour
    try {
      await this.redis.set(
        `${REDIS_KEY_PREFIX}${kid}`,
        signingKey,
        'EX',
        REDIS_KEY_TTL,
      );
      this.logger.debug(`Cached JWKS key for kid: ${kid}`);
    } catch (err) {
      this.logger.warn(`Redis write failed for JWKS key: ${(err as Error).message}`);
    }

    return signingKey;
  }

  private extractRoles(payload: KeycloakTokenPayload): string[] {
    const roles: string[] = [];

    // Extract realm-level roles
    if (payload.realm_access?.roles) {
      roles.push(...payload.realm_access.roles);
    }

    // Extract client-level roles (ifarm-api client)
    const clientAccess = payload.resource_access?.['ifarm-api'];
    if (clientAccess?.roles) {
      roles.push(...clientAccess.roles);
    }

    return [...new Set(roles)];
  }
}
