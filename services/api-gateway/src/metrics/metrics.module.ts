import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    makeGaugeProvider({
      name: 'circuit_breaker_state',
      help: 'Circuit breaker state (0=closed, 1=half-open, 2=open)',
      labelNames: ['service'],
    }),
    makeCounterProvider({
      name: 'proxy_errors_total',
      help: 'Total number of proxy errors',
      labelNames: ['service', 'error_type'],
    }),
    makeHistogramProvider({
      name: 'proxy_request_duration_seconds',
      help: 'Proxy request duration in seconds',
      labelNames: ['service', 'method', 'status_code'],
      buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    makeCounterProvider({
      name: 'rate_limit_exceeded_total',
      help: 'Total number of rate limit exceeded events',
      labelNames: ['tier', 'path'],
    }),
    makeCounterProvider({
      name: 'auth_failures_total',
      help: 'Total number of authentication failures',
      labelNames: ['reason'],
    }),
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}
