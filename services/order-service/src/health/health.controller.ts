import { Controller, Get } from '@nestjs/common';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    rabbitmq: { status: string };
  };
}

@Controller()
export class HealthController {
  private readonly startTime: number;

  constructor(private readonly rabbitmqService: RabbitmqService) {
    this.startTime = Date.now();
  }

  @Get('health')
  getHealth(): HealthStatus {
    const rabbitHealthy = this.rabbitmqService.isHealthy();

    return {
      status: rabbitHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        rabbitmq: { status: rabbitHealthy ? 'up' : 'down' },
      },
    };
  }
}
