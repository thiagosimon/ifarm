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
      () => this.mongoose.pingCheck('mongodb'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb'),
      async () => {
        const isHealthy = this.rabbitmqService.isHealthy();
        if (isHealthy) {
          return { rabbitmq: { status: 'up' } };
        }
        throw new Error('RabbitMQ is not connected');
      },
    ]);
  }
}
