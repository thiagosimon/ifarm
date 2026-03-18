import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from './rate-limiter.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);

  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const path = req.url.split('?')[0];
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    const user = (req as any).user;
    const userId = user?.id;
    const userRole = user?.roles?.[0];

    const tier = this.rateLimiterService.getTier(path, userRole);
    const identifier = this.rateLimiterService.getIdentifier(path, ip, userId);

    const result = await this.rateLimiterService.checkRateLimit(identifier, tier);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', result.limit.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    res.setHeader('X-RateLimit-Reset', result.resetAt.toString());

    if (!result.allowed) {
      this.logger.warn(
        `Rate limit exceeded for ${tier}:${identifier} on ${req.method} ${path}`,
      );

      res.status(429).json({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
        error: 'Too Many Requests',
        retryAfter: result.resetAt - Math.floor(Date.now() / 1000),
      });
      return;
    }

    next();
  }
}
