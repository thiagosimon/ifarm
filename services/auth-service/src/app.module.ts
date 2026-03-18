import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [AuthModule, HealthModule, RabbitMQModule],
})
export class AppModule {}
