import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { MatchingService, QuoteData } from '../matching.service';

const EXCHANGE_NAME = 'ifarm.events';
const QUEUE_NAME = 'matching.quote_events';

@Injectable()
export class MatchingEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(MatchingEventsConsumer.name);
  private connection: amqp.AmqpConnectionManager;

  constructor(private readonly matchingService: MatchingService) {}

  async onModuleInit(): Promise<void> {
    const uri = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

    this.connection = amqp.connect([uri], {
      heartbeatIntervalInSeconds: 30,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () => {
      this.logger.log('Consumer: RabbitMQ connected');
    });

    this.connection.on('disconnect', (err: any) => {
      this.logger.warn(`Consumer: RabbitMQ disconnected: ${err?.message}`);
    });

    const channelWrapper = this.connection.createChannel({
      json: false,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        // Assert queue with DLX
        await channel.assertQueue(QUEUE_NAME, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': 'ifarm.events.dlx',
            'x-dead-letter-routing-key': `${QUEUE_NAME}.dead`,
          },
        });

        // Bind to quotation events
        await channel.bindQueue(
          QUEUE_NAME,
          EXCHANGE_NAME,
          'quotation.quote.created',
        );
        await channel.bindQueue(
          QUEUE_NAME,
          EXCHANGE_NAME,
          'quotation.recurring.triggered',
        );

        // Prefetch 1 for ordered processing
        await channel.prefetch(1);

        // Start consuming
        await channel.consume(QUEUE_NAME, async (msg: ConsumeMessage | null) => {
          if (!msg) return;

          const routingKey = msg.fields.routingKey;
          this.logger.debug(`Received event: ${routingKey}`);

          try {
            const payload = JSON.parse(msg.content.toString());
            await this.handleMessage(routingKey, payload);
            channel.ack(msg);
          } catch (err: any) {
            this.logger.error(
              `Error processing ${routingKey}: ${err.message}`,
              err.stack,
            );

            // Check retry count
            const retryCount =
              (msg.properties.headers?.['x-retry-count'] as number) || 0;
            if (retryCount >= 3) {
              this.logger.warn(
                `Max retries reached for ${routingKey}, sending to DLQ`,
              );
              channel.nack(msg, false, false); // Send to DLX
            } else {
              channel.nack(msg, false, true); // Requeue
            }
          }
        });

        this.logger.log(`Consumer ready, listening on queue: ${QUEUE_NAME}`);
      },
    });

    await channelWrapper.waitForConnect();
  }

  private async handleMessage(
    routingKey: string,
    payload: any,
  ): Promise<void> {
    switch (routingKey) {
      case 'quotation.quote.created':
        await this.handleQuoteCreated(payload);
        break;

      case 'quotation.recurring.triggered':
        await this.handleRecurringTriggered(payload);
        break;

      default:
        this.logger.warn(`Unhandled routing key: ${routingKey}`);
    }
  }

  private async handleQuoteCreated(payload: any): Promise<void> {
    this.logger.log(`Processing quote created: ${payload.quoteId}`);

    const quoteData: QuoteData = {
      quoteId: payload.quoteId,
      farmerId: payload.farmerId,
      farmerSnapshot: payload.farmerSnapshot,
      items: payload.items,
      preferredPaymentMethod: payload.preferredPaymentMethod,
    };

    await this.matchingService.processQuoteCreated(quoteData);
  }

  private async handleRecurringTriggered(payload: any): Promise<void> {
    this.logger.log(
      `Processing recurring quote triggered: ${payload.quoteId}`,
    );

    const quoteData: QuoteData = {
      quoteId: payload.quoteId,
      farmerId: payload.farmerId,
      farmerSnapshot: payload.farmerSnapshot,
      items: payload.items,
      preferredPaymentMethod: payload.preferredPaymentMethod,
    };

    await this.matchingService.processQuoteCreated(quoteData);
  }
}
