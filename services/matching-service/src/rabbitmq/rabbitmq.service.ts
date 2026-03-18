import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

const EXCHANGE_NAME = 'ifarm.events';
const EXCHANGE_TYPE = 'topic';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private isConnected = false;

  async onModuleInit(): Promise<void> {
    const uri = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    this.connection = amqp.connect([uri], {
      heartbeatIntervalInSeconds: 30,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () => {
      this.logger.log('RabbitMQ connected');
      this.isConnected = true;
    });

    this.connection.on('disconnect', (err: any) => {
      this.logger.warn(`RabbitMQ disconnected: ${err?.message}`);
      this.isConnected = false;
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
          durable: true,
        });

        // Dead-letter exchange
        await channel.assertExchange('ifarm.events.dlx', 'topic', {
          durable: true,
        });
        await channel.assertQueue('ifarm.events.dlq', {
          durable: true,
          arguments: {
            'x-message-ttl': 86400000, // 24h
          },
        });
        await channel.bindQueue('ifarm.events.dlq', 'ifarm.events.dlx', '#');
      },
    });

    await this.channelWrapper.waitForConnect();
    this.logger.log('RabbitMQ channel ready');
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channelWrapper?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (err: any) {
      this.logger.error(`Error closing RabbitMQ: ${err.message}`);
    }
  }

  async publish(routingKey: string, payload: Record<string, any>): Promise<void> {
    const message = {
      ...payload,
      _meta: {
        service: 'matching-service',
        routingKey,
        publishedAt: new Date().toISOString(),
      },
    };

    try {
      await this.channelWrapper.publish(EXCHANGE_NAME, routingKey, message, {
        persistent: true,
        contentType: 'application/json',
        headers: {
          'x-retry-count': 0,
        },
      });
      this.logger.debug(`Published event: ${routingKey}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to publish event ${routingKey}: ${err.message}`,
      );
      throw err;
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}
