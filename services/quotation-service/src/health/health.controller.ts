import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // MongoDB connectivity
      () => this.mongoose.pingCheck('mongodb'),

      // RabbitMQ connectivity
      async () => {
        const isHealthy = this.rabbitmqService.isHealthy();
        if (isHealthy) {
          return {
            rabbitmq: {
              status: 'up' as const,
            },
          };
        }
        throw new Error('RabbitMQ is not connected');
      },
    ]);
  }

  /**
   * Lightweight liveness probe for Kubernetes.
   */
  @Get('live')
  live() {
    return { status: 'ok', service: 'quotation-service', timestamp: new Date().toISOString() };
  }

  /**
   * Readiness probe - checks all dependencies.
   */
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.check();
  }
}
