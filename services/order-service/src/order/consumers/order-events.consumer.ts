import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from '../../rabbitmq/rabbitmq.service';
import { OrderService } from '../order.service';

@Injectable()
export class OrderEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(OrderEventsConsumer.name);

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly orderService: OrderService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitmqService.subscribe(
      'order-service.proposal.accepted',
      'quotation.proposal.accepted',
      this.handleProposalAccepted.bind(this),
    );

    await this.rabbitmqService.subscribe(
      'order-service.auto.accepted',
      'quotation.auto.accepted',
      this.handleProposalAccepted.bind(this),
    );

    await this.rabbitmqService.subscribe(
      'order-service.payment.confirmed',
      'payment.confirmed',
      this.handlePaymentConfirmed.bind(this),
    );

    await this.rabbitmqService.subscribe(
      'order-service.payment.failed',
      'payment.failed',
      this.handlePaymentFailed.bind(this),
    );

    this.logger.log('Order events consumer initialized');
  }

  private async handleProposalAccepted(msg: any): Promise<void> {
    this.logger.log(`Received proposal accepted event for proposalId=${msg.proposalId}`);
    try {
      await this.orderService.createFromProposal({
        proposalId: msg.proposalId,
        quoteId: msg.quoteId,
        farmerId: msg.farmerId,
        retailerId: msg.retailerId,
        items: msg.items,
        totalAmount: msg.totalAmount,
        commissionAmount: msg.commissionAmount,
        paymentMethod: msg.paymentMethod || 'PIX',
      });
    } catch (err: any) {
      this.logger.error(`Failed to create order from proposal ${msg.proposalId}: ${err.message}`);
      throw err; // Requeue
    }
  }

  private async handlePaymentConfirmed(msg: any): Promise<void> {
    this.logger.log(`Received payment confirmed event for orderId=${msg.orderId}`);
    try {
      await this.orderService.confirmPayment({
        orderId: msg.orderId,
        pagarmeTransactionId: msg.pagarmeTransactionId,
      });
    } catch (err: any) {
      this.logger.error(`Failed to confirm payment for order ${msg.orderId}: ${err.message}`);
      throw err;
    }
  }

  private async handlePaymentFailed(msg: any): Promise<void> {
    this.logger.log(`Received payment failed event for orderId=${msg.orderId}`);
    try {
      await this.orderService.handlePaymentFailed({
        orderId: msg.orderId,
        reason: msg.reason || 'Unknown failure',
      });
    } catch (err: any) {
      this.logger.error(`Failed to handle payment failure for order ${msg.orderId}: ${err.message}`);
      throw err;
    }
  }
}
