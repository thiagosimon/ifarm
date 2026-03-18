import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { KeycloakAdapter } from '../keycloak.adapter';

interface UserRegisteredEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

@Injectable()
export class AuthEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(AuthEventsConsumer.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly keycloakAdapter: KeycloakAdapter,
  ) {}

  async onModuleInit() {
    await this.setupConsumers();
  }

  private async setupConsumers() {
    await this.rabbitMQService.consume(
      'auth.identity.farmer.registered',
      'identity.farmer.registered',
      async (message: UserRegisteredEvent) => {
        await this.handleUserRegistered(message, 'farmer');
      },
    );

    await this.rabbitMQService.consume(
      'auth.identity.retailer.registered',
      'identity.retailer.registered',
      async (message: UserRegisteredEvent) => {
        await this.handleUserRegistered(message, 'retailer');
      },
    );

    this.logger.log('Auth event consumers initialized');
  }

  private async handleUserRegistered(
    event: UserRegisteredEvent,
    role: string,
  ) {
    try {
      this.logger.log(
        `Processing ${role} registration for email=${event.email}`,
      );

      const keycloakUserId = await this.keycloakAdapter.createUser({
        email: event.email,
        firstName: event.firstName,
        lastName: event.lastName,
        password: event.password,
        role,
      });

      this.logger.log(
        `Keycloak user created for email=${event.email}, keycloakUserId=${keycloakUserId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create Keycloak user for email=${event.email}: ${error.message}`,
        error.stack,
      );
    }
  }
}
