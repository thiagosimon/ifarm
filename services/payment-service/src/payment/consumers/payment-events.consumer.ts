import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from '../../rabbitmq/rabbitmq.service';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(PaymentEventsConsumer.name);

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly paymentService: PaymentService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitmqService.subscribe(
      'payment-service.order.created',
      'order.created',
      this.handleOrderCreated.bind(this),
    );

    this.logger.log('Payment events consumer initialized');
  }

  private async handleOrderCreated(msg: any): Promise<void> {
    this.logger.log(`Received order.created event for orderId=${msg.orderId}`);

    try {
      await this.paymentService.createCharge({
        orderId: msg.orderId,
        orderNumber: msg.orderNumber,
        farmerId: msg.farmerId,
        retailerId: msg.retailerId,
        items: msg.items,
        totalAmount: msg.totalAmount,
        commissionAmount: msg.commissionAmount,
        paymentMethod: msg.paymentMethod,
        customer: msg.customer,
        cardToken: msg.cardToken,
        installments: msg.installments,
      });
    } catch (err: any) {
      this.logger.error(
        `Failed to create charge for order ${msg.orderId}: ${err.message}`,
      );
      throw err; // Requeue
    }
  }
}
