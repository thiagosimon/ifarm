import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqpConnectionManager from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { Channel } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: amqpConnectionManager.AmqpConnectionManager | null = null;
  private channelWrapper: ChannelWrapper | null = null;
  private readonly uri: string;
  private readonly exchanges: string[] = ['identity.events'];

  constructor() {
    this.uri = process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672';
  }

  async onModuleInit(): Promise<void> {
    try {
      this.connection = amqpConnectionManager.connect([this.uri], {
        heartbeatIntervalInSeconds: 30,
        reconnectTimeInSeconds: 5,
      });

      this.connection.on('connect', () => {
        this.logger.log('RabbitMQ connected');
      });

      this.connection.on('disconnect', (err: any) => {
        this.logger.warn(`RabbitMQ disconnected: ${err?.err?.message || 'unknown'}`);
      });

      this.channelWrapper = this.connection.createChannel({
        json: true,
        setup: async (channel: Channel) => {
          for (const exchange of this.exchanges) {
            await channel.assertExchange(exchange, 'topic', {
              durable: true,
            });
          }
          this.logger.log(
            `RabbitMQ exchanges asserted: ${this.exchanges.join(', ')}`,
          );
        },
      });

      await this.channelWrapper.waitForConnect();
      this.logger.log('RabbitMQ channel ready');
    } catch (error) {
      this.logger.error(
        `Failed to initialize RabbitMQ: ${(error as Error).message}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.channelWrapper) {
        await this.channelWrapper.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error(
        `Error closing RabbitMQ: ${(error as Error).message}`,
      );
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: Record<string, any>,
  ): Promise<void> {
    if (!this.channelWrapper) {
      this.logger.warn(
        `RabbitMQ channel not available, skipping publish to ${exchange}/${routingKey}`,
      );
      return;
    }

    try {
      const envelope = {
        eventType: routingKey,
        timestamp: new Date().toISOString(),
        source: 'identity-service',
        data: message,
      };

      await this.channelWrapper.publish(exchange, routingKey, envelope, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
        appId: 'identity-service',
      });

      this.logger.debug(`Published event: ${routingKey} to ${exchange}`);
    } catch (error) {
      this.logger.error(
        `Failed to publish to ${exchange}/${routingKey}: ${(error as Error).message}`,
      );
    }
  }

  isConnected(): boolean {
    return this.connection?.isConnected() || false;
  }
}
