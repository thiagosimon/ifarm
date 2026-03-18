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
  readiness() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb'),
      async () => {
        const isConnected = this.rabbitmqService.isConnected();
        if (!isConnected) {
          throw new Error('RabbitMQ is not connected');
        }
        return { rabbitmq: { status: 'up' } };
      },
    ]);
  }
}
