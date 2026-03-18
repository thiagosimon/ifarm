import { Controller, Get, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Public } from '../decorators/public.decorator';
import { ROUTE_MAP } from '../config/routes.config';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
}

interface ReadinessStatus extends HealthStatus {
  checks: {
    redis: { status: string; latencyMs?: number; error?: string };
    services: Record<string, { status: string; error?: string }>;
  };
}

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly redis: Redis;
  private readonly startTime: number;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      connectTimeout: 3000,
      retryStrategy(times: number) {
        if (times > 2) return null;
        return Math.min(times * 100, 1000);
      },
    });

    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis connection failed for health checks: ${err.message}`);
    });

    this.startTime = Date.now();
  }

  /**
   * Liveness probe - returns 200 if the process is running.
   * Used by Kubernetes to know if the container should be restarted.
   */
  @Get('health')
  @Public()
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  /**
   * Readiness probe - checks if the gateway can serve traffic.
   * Checks Redis connectivity and downstream service availability.
   */
  @Get('ready')
  @Public()
  async getReady(): Promise<ReadinessStatus> {
    const checks: ReadinessStatus['checks'] = {
      redis: { status: 'unknown' },
      services: {},
    };

    let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';

    // Check Redis
    try {
      const start = Date.now();
      await this.redis.ping();
      const latencyMs = Date.now() - start;
      checks.redis = { status: 'up', latencyMs };
    } catch (err) {
      checks.redis = {
        status: 'down',
        error: (err as Error).message,
      };
      overallStatus = 'degraded';
    }

    // Check downstream services with TCP connect check
    const serviceChecks = ROUTE_MAP.map(async (route) => {
      try {
        const url = new URL(route.target);
        const hostname = url.hostname;
        const port = parseInt(url.port, 10);

        const isUp = await this.checkTcpConnection(hostname, port, 2000);
        checks.services[route.serviceName] = {
          status: isUp ? 'up' : 'down',
        };

        if (!isUp) {
          overallStatus = overallStatus === 'ok' ? 'degraded' : overallStatus;
        }
      } catch (err) {
        checks.services[route.serviceName] = {
          status: 'down',
          error: (err as Error).message,
        };
        overallStatus = overallStatus === 'ok' ? 'degraded' : overallStatus;
      }
    });

    await Promise.allSettled(serviceChecks);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: process.env.npm_package_version || '1.0.0',
      checks,
    };
  }

  /**
   * Checks TCP connectivity to a host:port with a timeout.
   */
  private checkTcpConnection(
    host: string,
    port: number,
    timeoutMs: number,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // Use dynamic import to avoid issues at module load time
      const net = require('net');
      const socket = new net.Socket();

      socket.setTimeout(timeoutMs);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, host);
    });
  }
}
