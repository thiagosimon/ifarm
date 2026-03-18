import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { ProxyMiddleware } from './middleware/proxy.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { RateLimiterService } from './middleware/rate-limiter.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [HealthModule, MetricsModule, CircuitBreakerModule],
  providers: [
    RateLimiterService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // 1. Correlation ID middleware - runs first on all routes
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // 2. Rate limiting middleware - runs on API routes
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });

    // 3. Proxy middleware - routes requests to downstream services
    consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });
  }
}
