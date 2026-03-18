import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommissionService } from '../commission.service';
import { RabbitmqService } from '../../rabbitmq/rabbitmq.service';

@Injectable()
export class CommissionEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(CommissionEventsConsumer.name);

  constructor(
    private readonly commissionService: CommissionService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async onModuleInit() {
    await this.subscribeToOrderDelivered();
    await this.subscribeToPaymentConfirmed();
  }

  /**
   * Consume order.delivered events.
   * Creates a new commission record and schedules holdback release.
   */
  private async subscribeToOrderDelivered() {
    await this.rabbitmqService.subscribe('order.delivered', async (msg: any) => {
      this.logger.log(`Received order.delivered event for order ${msg.orderId}`);

      try {
        await this.commissionService.createCommission({
          orderId: msg.orderId,
          retailerId: msg.retailerId,
          farmerId: msg.farmerId,
          orderTotalAmount: msg.totalAmount,
          transactionType: msg.transactionType,
          deliveredAt: msg.deliveredAt,
        });

        this.logger.log(`Commission created for order ${msg.orderId}`);
      } catch (error) {
        this.logger.error(
          `Failed to create commission for order ${msg.orderId}: ${(error as Error).message}`,
          (error as Error).stack,
        );
        throw error;
      }
    });

    this.logger.log('Subscribed to order.delivered events');
  }

  /**
   * Consume payment.confirmed events.
   * Updates the commission transaction reference if applicable.
   */
  private async subscribeToPaymentConfirmed() {
    await this.rabbitmqService.subscribe('payment.confirmed', async (msg: any) => {
      this.logger.log(`Received payment.confirmed event for order ${msg.orderId}`);

      try {
        const commission = await this.commissionService.findById(msg.commissionId);
        if (!commission) {
          this.logger.warn(`No commission found for payment confirmation: ${msg.commissionId}`);
          return;
        }

        this.logger.log(
          `Payment confirmed for commission ${commission.id}, transaction ${msg.transactionId}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to process payment.confirmed for order ${msg.orderId}: ${(error as Error).message}`,
          (error as Error).stack,
        );
        throw error;
      }
    });

    this.logger.log('Subscribed to payment.confirmed events');
  }
}
