import { Controller, Get, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
  checks: Record<string, { status: string; message?: string }>;
}

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Get()
  async liveness(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      service: 'identity-service',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {},
    };
  }

  @Get('ready')
  async readiness(): Promise<HealthCheckResult> {
    const checks: Record<string, { status: string; message?: string }> = {};

    const mongoReady = this.mongoConnection.readyState === 1;
    checks['mongodb'] = {
      status: mongoReady ? 'up' : 'down',
      message: mongoReady ? 'Connected' : `State: ${this.mongoConnection.readyState}`,
    };

    const rabbitReady = this.rabbitmqService.isConnected();
    checks['rabbitmq'] = {
      status: rabbitReady ? 'up' : 'down',
      message: rabbitReady ? 'Connected' : 'Disconnected',
    };

    const allUp = Object.values(checks).every((c) => c.status === 'up');

    return {
      status: allUp ? 'ok' : 'degraded',
      service: 'identity-service',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
