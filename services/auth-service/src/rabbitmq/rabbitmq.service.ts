import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

interface ChannelWrapper {
  assertExchange(exchange: string, type: string, options?: object): Promise<void>;
  assertQueue(queue: string, options?: object): Promise<{ queue: string }>;
  bindQueue(queue: string, exchange: string, routingKey: string): Promise<void>;
  publish(exchange: string, routingKey: string, content: Buffer, options?: object): boolean;
  consume(queue: string, handler: (msg: any) => void, options?: object): Promise<void>;
  ack(msg: any): void;
  nack(msg: any, allUpTo?: boolean, requeue?: boolean): void;
  close(): Promise<void>;
}

interface ConnectionWrapper {
  createChannel(): Promise<ChannelWrapper>;
  close(): Promise<void>;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: ConnectionWrapper | null = null;
  private channel: ChannelWrapper | null = null;
  private readonly exchange = 'ifarm.events';

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const amqpUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

      // Dynamic import to handle missing amqplib gracefully
      let amqplib: any;
      try {
        amqplib = await import('amqplib' as string);
      } catch {
        this.logger.warn(
          'amqplib not installed. RabbitMQ features disabled. Install with: npm install amqplib',
        );
        return;
      }

      this.connection = await amqplib.connect(amqpUrl);
      this.channel = await this.connection!.createChannel();

      await this.channel!.assertExchange(this.exchange, 'topic', {
        durable: true,
      });

      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.warn(
        `Failed to connect to RabbitMQ: ${error.message}. Service will continue without messaging.`,
      );
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error(`Error disconnecting from RabbitMQ: ${error.message}`);
    }
  }

  async publish(routingKey: string, message: object): Promise<void> {
    if (!this.channel) {
      this.logger.warn('RabbitMQ channel not available, skipping publish');
      return;
    }

    try {
      const buffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(this.exchange, routingKey, buffer, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
      });
      this.logger.debug(`Published message to ${routingKey}`);
    } catch (error) {
      this.logger.error(
        `Failed to publish message to ${routingKey}: ${error.message}`,
      );
    }
  }

  async consume(
    queue: string,
    routingKey: string,
    handler: (message: any) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) {
      this.logger.warn('RabbitMQ channel not available, skipping consumer setup');
      return;
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, this.exchange, routingKey);

      await this.channel.consume(
        queue,
        async (msg: any) => {
          if (!msg) return;

          try {
            const content = JSON.parse(msg.content.toString());
            await handler(content);
            this.channel!.ack(msg);
          } catch (error) {
            this.logger.error(
              `Error processing message from ${queue}: ${error.message}`,
              error.stack,
            );
            this.channel!.nack(msg, false, false);
          }
        },
        { noAck: false },
      );

      this.logger.log(`Consumer set up for queue=${queue}, routingKey=${routingKey}`);
    } catch (error) {
      this.logger.error(
        `Failed to set up consumer for ${queue}: ${error.message}`,
      );
    }
  }

  isConnected(): boolean {
    return this.channel !== null;
  }
}
