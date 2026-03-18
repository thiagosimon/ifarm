import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { RabbitmqService } from '../../rabbitmq/rabbitmq.service';

const SUBSCRIBED_EVENTS = [
  'identity.kyc.approved',
  'identity.kyc.rejected',
  'quotation.quote.created',
  'quotation.proposal.received',
  'quotation.proposal.accepted',
  'payment.pix.pending',
  'payment.confirmed',
  'payment.failed',
  'order.dispatched',
  'order.delivered',
  'commission.released',
  'order.disputed',
];

@Injectable()
export class NotificationEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationEventsConsumer.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitmqService.subscribe(
      'notification.events',
      'notification.queue',
      SUBSCRIBED_EVENTS,
      async (eventType: string, payload: Record<string, any>) => {
        await this.handleEvent(eventType, payload);
      },
    );

    this.logger.log(
      `Subscribed to ${SUBSCRIBED_EVENTS.length} event types on notification.queue`,
    );
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Notification events consumer shutting down');
  }

  private async handleEvent(
    eventType: string,
    payload: Record<string, any>,
  ): Promise<void> {
    this.logger.log(
      `Received event: ${eventType} | recipientId=${payload.recipientId || payload.farmerId || payload.retailerId || 'N/A'}`,
    );

    try {
      await this.notificationService.routeNotification(eventType, payload);
      this.logger.log(`Event ${eventType} processed successfully`);
    } catch (error: any) {
      this.logger.error(
        `Failed to process event ${eventType}: ${error.message}`,
      );
    }
  }
}
