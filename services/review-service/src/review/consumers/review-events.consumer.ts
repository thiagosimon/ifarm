import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ReviewService } from '../review.service';
import { RabbitmqService } from '../../rabbitmq/rabbitmq.service';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class ReviewEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReviewEventsConsumer.name);
  private expirationTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly reviewService: ReviewService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitmqService.subscribe(
      'notification.events',
      'review.eligibility.queue',
      ['order.delivered'],
      async (eventType: string, payload: Record<string, any>) => {
        await this.handleOrderDelivered(payload);
      },
    );

    this.logger.log('Subscribed to order.delivered events for review eligibility');
  }

  async onModuleDestroy(): Promise<void> {
    for (const [orderId, timer] of this.expirationTimers) {
      clearTimeout(timer);
      this.logger.debug(`Cleared expiration timer for order ${orderId}`);
    }
    this.expirationTimers.clear();
    this.logger.log('Review events consumer shutting down');
  }

  private async handleOrderDelivered(
    payload: Record<string, any>,
  ): Promise<void> {
    const { orderId, farmerId, retailerId } = payload;

    if (!orderId || !farmerId || !retailerId) {
      this.logger.warn(
        'order.delivered event missing required fields (orderId, farmerId, retailerId)',
      );
      return;
    }

    this.logger.log(
      `Processing order.delivered for order ${orderId}: creating review eligibility`,
    );

    try {
      await this.reviewService.createEligibility(orderId, farmerId, retailerId);

      const timer = setTimeout(async () => {
        try {
          await this.reviewService.expireEligibility(orderId);
          this.expirationTimers.delete(orderId);
        } catch (error: any) {
          this.logger.error(
            `Failed to expire eligibility for order ${orderId}: ${error.message}`,
          );
        }
      }, THIRTY_DAYS_MS);

      this.expirationTimers.set(orderId, timer);
      this.logger.log(
        `Eligibility expiration scheduled for order ${orderId} in 30 days`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to create eligibility for order ${orderId}: ${error.message}`,
      );
    }
  }
}
