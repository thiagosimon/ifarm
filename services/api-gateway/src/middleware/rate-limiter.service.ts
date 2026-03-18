import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
}

interface RateLimitTier {
  maxRequests: number;
  windowSeconds: number;
}

const RATE_LIMIT_TIERS: Record<string, RateLimitTier> = {
  FARMER: { maxRequests: 100, windowSeconds: 60 },
  RETAILER: { maxRequests: 100, windowSeconds: 60 },
  ADMIN: { maxRequests: 1000, windowSeconds: 60 },
  AUTH: { maxRequests: 10, windowSeconds: 60 },
  DEFAULT: { maxRequests: 100, windowSeconds: 60 },
};

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private readonly redis: Redis;

  constructor() {
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
      this.logger.warn(`Redis connection failed for rate limiter: ${err.message}`);
    });
  }

  /**
   * Check and consume a rate limit token using a sliding window approach in Redis.
   */
  async checkRateLimit(
    identifier: string,
    tier: string,
  ): Promise<RateLimitResult> {
    const config = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.DEFAULT;
    const key = `ratelimit:${tier}:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - config.windowSeconds;

    try {
      const pipeline = this.redis.pipeline();

      // Remove expired entries
      pipeline.zremrangebyscore(key, 0, windowStart);

      // Count current entries in window
      pipeline.zcard(key);

      // Add current request
      pipeline.zadd(key, now.toString(), `${now}:${Math.random()}`);

      // Set TTL on the key
      pipeline.expire(key, config.windowSeconds);

      const results = await pipeline.exec();

      if (!results) {
        // Redis unavailable - fail open (allow request)
        this.logger.warn('Rate limiter: Redis pipeline returned null, failing open');
        return {
          allowed: true,
          remaining: config.maxRequests,
          limit: config.maxRequests,
          resetAt: now + config.windowSeconds,
        };
      }

      const currentCount = (results[1]?.[1] as number) || 0;
      const allowed = currentCount < config.maxRequests;
      const remaining = Math.max(0, config.maxRequests - currentCount - 1);

      if (!allowed) {
        // Remove the request we just added since it was not allowed
        const lastResult = results[2];
        if (lastResult) {
          await this.redis.zremrangebyscore(key, now, now).catch(() => {
            // Ignore cleanup errors
          });
        }
      }

      return {
        allowed,
        remaining: allowed ? remaining : 0,
        limit: config.maxRequests,
        resetAt: now + config.windowSeconds,
      };
    } catch (err) {
      // Fail open on Redis errors - do not block requests if rate limiting is unavailable
      this.logger.warn(`Rate limiter error: ${(err as Error).message}. Failing open.`);
      return {
        allowed: true,
        remaining: config.maxRequests,
        limit: config.maxRequests,
        resetAt: now + config.windowSeconds,
      };
    }
  }

  /**
   * Determines the rate limit tier based on the request context.
   * Auth routes get their own strict tier. Otherwise, tier is by user role.
   */
  getTier(path: string, userRole?: string): string {
    if (
      path.startsWith('/api/v1/auth/login') ||
      path.startsWith('/api/v1/auth/refresh')
    ) {
      return 'AUTH';
    }

    if (userRole) {
      const upperRole = userRole.toUpperCase();
      if (upperRole in RATE_LIMIT_TIERS) {
        return upperRole;
      }
    }

    return 'DEFAULT';
  }

  /**
   * Determines the identifier for rate limiting.
   * Auth routes are limited by IP. Authenticated routes are limited by userId.
   */
  getIdentifier(
    path: string,
    ip: string,
    userId?: string,
  ): string {
    if (
      path.startsWith('/api/v1/auth/login') ||
      path.startsWith('/api/v1/auth/refresh')
    ) {
      return ip;
    }

    return userId || ip;
  }
}
