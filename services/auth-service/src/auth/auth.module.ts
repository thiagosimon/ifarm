import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeycloakAdapter } from './keycloak.adapter';
import { AuthEventsConsumer } from './consumers/auth-events.consumer';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [AuthController],
  providers: [AuthService, KeycloakAdapter, AuthEventsConsumer],
  exports: [AuthService, KeycloakAdapter],
})
export class AuthModule {}
