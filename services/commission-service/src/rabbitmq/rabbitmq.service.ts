import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  private readonly exchange = 'ifarm.events';
  private readonly queuePrefix = 'commission-service';

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL || 'amqp://ifarm:ifarm123@localhost:5672';

    this.connection = amqp.connect([url]);

    this.connection.on('connect', () => {
      this.logger.log('Connected to RabbitMQ');
    });

    this.connection.on('disconnect', (err: any) => {
      this.logger.error('Disconnected from RabbitMQ', err?.message);
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(this.exchange, 'topic', { durable: true });
        this.logger.log(`Exchange "${this.exchange}" asserted`);
      },
    });

    await this.channelWrapper.waitForConnect();
    this.logger.log('RabbitMQ channel ready');
  }

  async onModuleDestroy() {
    try {
      await this.channelWrapper?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', (error as Error).message);
    }
  }

  /**
   * Publish a message to the exchange with the given routing key.
   */
  async publish(routingKey: string, message: Record<string, any>): Promise<void> {
    try {
      await this.channelWrapper.publish(this.exchange, routingKey, message, {
        persistent: true,
        timestamp: Date.now(),
        headers: {
          'x-source': 'commission-service',
        },
      });
      this.logger.debug(`Published message to "${routingKey}"`);
    } catch (error) {
      this.logger.error(
        `Failed to publish to "${routingKey}": ${(error as Error).message}`,
      );
      throw error;
    }
  }

  /**
   * Subscribe to a specific routing key pattern.
   * Creates a dedicated queue for this service + routing key.
   */
  async subscribe(
    routingKey: string,
    handler: (msg: any) => Promise<void>,
  ): Promise<void> {
    const queueName = `${this.queuePrefix}.${routingKey}`;

    const consumerChannel = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(this.exchange, 'topic', { durable: true });

        const queue = await channel.assertQueue(queueName, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': `${this.exchange}.dlx`,
            'x-dead-letter-routing-key': `${queueName}.dlq`,
          },
        });

        await channel.bindQueue(queue.queue, this.exchange, routingKey);

        await channel.consume(
          queue.queue,
          async (msg) => {
            if (!msg) return;

            try {
              const content = JSON.parse(msg.content.toString());
              await handler(content);
              channel.ack(msg);
            } catch (error) {
              this.logger.error(
                `Error processing message from "${routingKey}": ${(error as Error).message}`,
              );
              // Reject and requeue once, then dead-letter
              channel.nack(msg, false, !msg.fields.redelivered);
            }
          },
          { noAck: false },
        );

        this.logger.log(`Consumer set up for queue "${queueName}" bound to "${routingKey}"`);
      },
    });

    await consumerChannel.waitForConnect();
  }
}
