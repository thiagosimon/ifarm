import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: amqp.AmqpConnectionManager | null = null;
  private channelWrapper: amqp.ChannelWrapper | null = null;

  async onModuleInit(): Promise<void> {
    const url =
      process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    this.connection = amqp.connect([url], {
      heartbeatIntervalInSeconds: 30,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () => {
      this.logger.log('RabbitMQ connected');
    });

    this.connection.on('disconnect', (err: any) => {
      this.logger.warn(`RabbitMQ disconnected: ${err?.message || 'unknown'}`);
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.prefetch(10);
      },
    });

    await this.channelWrapper.waitForConnect();
    this.logger.log('RabbitMQ channel ready');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channelWrapper) {
      await this.channelWrapper.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.logger.log('RabbitMQ connections closed');
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: Record<string, any>,
  ): Promise<void> {
    if (!this.channelWrapper) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.assertExchange(exchange, 'topic', { durable: true });
    });

    await this.channelWrapper.publish(exchange, routingKey, message, {
      persistent: true,
      timestamp: Date.now(),
      headers: {
        'x-source': 'review-service',
      },
    });

    this.logger.debug(`Published to ${exchange}/${routingKey}`);
  }

  async subscribe(
    exchange: string,
    queue: string,
    routingKeys: string[],
    handler: (eventType: string, payload: Record<string, any>) => Promise<void>,
  ): Promise<void> {
    if (!this.channelWrapper) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.assertExchange(exchange, 'topic', { durable: true });
      await channel.assertQueue(queue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': `${exchange}.dlx`,
          'x-dead-letter-routing-key': `${queue}.dlq`,
        },
      });

      await channel.assertExchange(`${exchange}.dlx`, 'direct', {
        durable: true,
      });
      await channel.assertQueue(`${queue}.dlq`, { durable: true });
      await channel.bindQueue(
        `${queue}.dlq`,
        `${exchange}.dlx`,
        `${queue}.dlq`,
      );

      for (const key of routingKeys) {
        await channel.bindQueue(queue, exchange, key);
      }

      await channel.consume(queue, async (msg) => {
        if (!msg) return;

        const routingKey = msg.fields.routingKey;
        try {
          const payload = JSON.parse(msg.content.toString());
          await handler(routingKey, payload);
          channel.ack(msg);
        } catch (error: any) {
          this.logger.error(
            `Error processing message ${routingKey}: ${error.message}`,
          );
          channel.nack(msg, false, false);
        }
      });

      this.logger.log(
        `Consuming from queue ${queue} with ${routingKeys.length} bindings`,
      );
    });
  }

  isConnected(): boolean {
    return this.connection?.isConnected() || false;
  }
}
