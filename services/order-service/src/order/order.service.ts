import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Order } from './entities/order.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

/**
 * Valid state transitions for the order state machine.
 * Key = current status, Value = array of valid next statuses.
 */
const VALID_TRANSITIONS: Record<string, string[]> = {
  AWAITING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED'],
  PREPARING: ['DISPATCHED'],
  DISPATCHED: ['DELIVERED'],
  DELIVERED: ['DISPUTED'],
};

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  /**
   * Creates an order from an accepted proposal.
   * Idempotent: if an order already exists for this proposalId, return it.
   * Triggered by quotation.proposal.accepted / quotation.auto.accepted events.
   */
  async createFromProposal(payload: {
    proposalId: string;
    quoteId: string;
    farmerId: string;
    retailerId: string;
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    totalAmount: number;
    commissionAmount: number;
    paymentMethod: string;
  }): Promise<Order> {
    // Idempotency: check if order already exists for this proposal
    const existing = await this.orderRepository.findOne({
      where: { proposalId: payload.proposalId },
    });

    if (existing) {
      this.logger.warn(`Order already exists for proposalId=${payload.proposalId}, returning existing order ${existing.id}`);
      return existing;
    }

    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    const order = this.orderRepository.create({
      orderNumber,
      quoteId: payload.quoteId,
      proposalId: payload.proposalId,
      farmerId: payload.farmerId,
      retailerId: payload.retailerId,
      items: payload.items,
      totalAmount: payload.totalAmount,
      commissionAmount: payload.commissionAmount,
      status: 'AWAITING_PAYMENT',
      paymentMethod: payload.paymentMethod,
      statusHistory: [
        {
          status: 'AWAITING_PAYMENT',
          changedAt: now,
          changedBy: 'system',
          note: 'Order created from accepted proposal',
        },
      ],
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order created: ${saved.id} (${saved.orderNumber}) for proposalId=${payload.proposalId}`);

    await this.rabbitmqService.publish('order.created', {
      orderId: saved.id,
      orderNumber: saved.orderNumber,
      proposalId: saved.proposalId,
      quoteId: saved.quoteId,
      farmerId: saved.farmerId,
      retailerId: saved.retailerId,
      items: saved.items,
      totalAmount: saved.totalAmount,
      commissionAmount: saved.commissionAmount,
      paymentMethod: saved.paymentMethod,
      status: saved.status,
    });

    return saved;
  }

  /**
   * Confirms payment for an order.
   * Transitions AWAITING_PAYMENT -> PAID.
   * Idempotent: if order is already PAID, skip.
   * Triggered by payment.confirmed event.
   */
  async confirmPayment(payload: {
    orderId: string;
    pagarmeTransactionId: string;
    changedBy?: string;
  }): Promise<Order> {
    const order = await this.findByIdOrFail(payload.orderId);

    // Idempotent: already paid
    if (order.status === 'PAID') {
      this.logger.warn(`Order ${order.id} is already PAID, skipping confirmPayment`);
      return order;
    }

    this.validateTransition(order.status, 'PAID');

    order.status = 'PAID';
    order.pagarmeTransactionId = payload.pagarmeTransactionId;
    order.statusHistory.push({
      status: 'PAID',
      changedAt: new Date().toISOString(),
      changedBy: payload.changedBy || 'system',
      note: `Payment confirmed (txn: ${payload.pagarmeTransactionId})`,
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order ${saved.id} payment confirmed`);

    await this.rabbitmqService.publish('order.paid', {
      orderId: saved.id,
      orderNumber: saved.orderNumber,
      farmerId: saved.farmerId,
      retailerId: saved.retailerId,
      totalAmount: saved.totalAmount,
    });

    return saved;
  }

  /**
   * Retailer marks order as PREPARING.
   * Transitions PAID -> PREPARING.
   */
  async prepare(orderId: string, retailerId: string): Promise<Order> {
    const order = await this.findByIdOrFail(orderId);

    if (order.retailerId !== retailerId) {
      throw new ForbiddenException('Only the assigned retailer can prepare this order');
    }

    this.validateTransition(order.status, 'PREPARING');

    order.status = 'PREPARING';
    order.statusHistory.push({
      status: 'PREPARING',
      changedAt: new Date().toISOString(),
      changedBy: retailerId,
      note: 'Retailer started preparing the order',
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order ${saved.id} is now PREPARING`);
    return saved;
  }

  /**
   * Retailer dispatches order with tracking code.
   * Transitions PAID -> PREPARING -> DISPATCHED (or PREPARING -> DISPATCHED).
   * trackingCode is required.
   */
  async dispatch(
    orderId: string,
    retailerId: string,
    trackingCode: string,
  ): Promise<Order> {
    const order = await this.findByIdOrFail(orderId);

    if (order.retailerId !== retailerId) {
      throw new ForbiddenException('Only the assigned retailer can dispatch this order');
    }

    if (!trackingCode || trackingCode.trim().length === 0) {
      throw new BadRequestException('trackingCode is required for dispatch');
    }

    this.validateTransition(order.status, 'DISPATCHED');

    order.status = 'DISPATCHED';
    order.trackingCode = trackingCode.trim();
    order.statusHistory.push({
      status: 'DISPATCHED',
      changedAt: new Date().toISOString(),
      changedBy: retailerId,
      note: `Dispatched with tracking code: ${trackingCode.trim()}`,
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order ${saved.id} dispatched with trackingCode=${trackingCode}`);

    await this.rabbitmqService.publish('order.dispatched', {
      orderId: saved.id,
      orderNumber: saved.orderNumber,
      farmerId: saved.farmerId,
      retailerId: saved.retailerId,
      trackingCode: saved.trackingCode,
    });

    return saved;
  }

  /**
   * Farmer confirms delivery.
   * Transitions DISPATCHED -> DELIVERED.
   */
  async confirmDelivery(orderId: string, farmerId: string): Promise<Order> {
    const order = await this.findByIdOrFail(orderId);

    if (order.farmerId !== farmerId) {
      throw new ForbiddenException('Only the assigned farmer can confirm delivery');
    }

    this.validateTransition(order.status, 'DELIVERED');

    const now = new Date();
    order.status = 'DELIVERED';
    order.deliveredAt = now;
    order.statusHistory.push({
      status: 'DELIVERED',
      changedAt: now.toISOString(),
      changedBy: farmerId,
      note: 'Farmer confirmed delivery',
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order ${saved.id} delivered`);

    await this.rabbitmqService.publish('order.delivered', {
      orderId: saved.id,
      orderNumber: saved.orderNumber,
      farmerId: saved.farmerId,
      retailerId: saved.retailerId,
      deliveredAt: saved.deliveredAt,
    });

    return saved;
  }

  /**
   * Farmer disputes the order within 7 days of delivery.
   * Transitions DELIVERED -> DISPUTED.
   * Reason must be at least 20 characters.
   */
  async dispute(
    orderId: string,
    farmerId: string,
    reason: string,
  ): Promise<Order> {
    const order = await this.findByIdOrFail(orderId);

    if (order.farmerId !== farmerId) {
      throw new ForbiddenException('Only the assigned farmer can dispute this order');
    }

    if (!reason || reason.trim().length < 20) {
      throw new BadRequestException('Dispute reason must be at least 20 characters');
    }

    this.validateTransition(order.status, 'DISPUTED');

    // Check 7-day window from delivery
    if (!order.deliveredAt) {
      throw new UnprocessableEntityException('Cannot dispute an order without a delivery date');
    }

    const deliveredAt = new Date(order.deliveredAt);
    const now = new Date();
    const daysSinceDelivery = (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 7) {
      throw new UnprocessableEntityException(
        'Dispute window has expired. Orders can only be disputed within 7 days of delivery.',
      );
    }

    order.status = 'DISPUTED';
    order.disputeReason = reason.trim();
    order.disputedAt = now;
    order.statusHistory.push({
      status: 'DISPUTED',
      changedAt: now.toISOString(),
      changedBy: farmerId,
      note: `Dispute filed: ${reason.trim()}`,
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order ${saved.id} disputed by farmer ${farmerId}`);

    await this.rabbitmqService.publish('order.disputed', {
      orderId: saved.id,
      orderNumber: saved.orderNumber,
      farmerId: saved.farmerId,
      retailerId: saved.retailerId,
      disputeReason: saved.disputeReason,
      disputedAt: saved.disputedAt,
    });

    return saved;
  }

  /**
   * Admin cancels an order. Only AWAITING_PAYMENT or PAID orders can be cancelled.
   * DISPATCHED+ cannot be cancelled.
   * If PAID, triggers refund via payment-service.
   */
  async cancel(orderId: string, adminId: string): Promise<Order> {
    const order = await this.findByIdOrFail(orderId);

    this.validateTransition(order.status, 'CANCELLED');

    // If order was PAID, trigger refund via payment-service
    if (order.status === 'PAID' && order.pagarmeTransactionId) {
      try {
        const paymentServiceUrl =
          process.env.PAYMENT_SERVICE_URL || 'http://localhost:3007';
        await axios.post(`${paymentServiceUrl}/v1/payments/${order.id}/refund`, {
          orderId: order.id,
          reason: 'Order cancelled by admin',
        });
        this.logger.log(`Refund triggered for order ${order.id}`);
      } catch (err: any) {
        this.logger.error(`Failed to trigger refund for order ${order.id}: ${err.message}`);
        throw new UnprocessableEntityException(
          'Failed to process refund. Cancellation aborted.',
        );
      }
    }

    order.status = 'CANCELLED';
    order.statusHistory.push({
      status: 'CANCELLED',
      changedAt: new Date().toISOString(),
      changedBy: adminId,
      note: 'Order cancelled by admin',
    });

    const saved = await this.orderRepository.save(order);
    this.logger.log(`Order ${saved.id} cancelled by admin ${adminId}`);

    await this.rabbitmqService.publish('order.cancelled', {
      orderId: saved.id,
      orderNumber: saved.orderNumber,
      farmerId: saved.farmerId,
      retailerId: saved.retailerId,
      totalAmount: saved.totalAmount,
    });

    return saved;
  }

  /**
   * Handles payment failure. Keeps order in AWAITING_PAYMENT.
   * Triggered by payment.failed event.
   */
  async handlePaymentFailed(payload: {
    orderId: string;
    reason: string;
  }): Promise<Order> {
    const order = await this.findByIdOrFail(payload.orderId);

    if (order.status !== 'AWAITING_PAYMENT') {
      this.logger.warn(
        `Order ${order.id} is in status ${order.status}, ignoring payment.failed`,
      );
      return order;
    }

    order.statusHistory.push({
      status: 'AWAITING_PAYMENT',
      changedAt: new Date().toISOString(),
      changedBy: 'system',
      note: `Payment failed: ${payload.reason}`,
    });

    return this.orderRepository.save(order);
  }

  /**
   * Returns the status history timeline for an order.
   */
  async getTimeline(orderId: string): Promise<Order['statusHistory']> {
    const order = await this.findByIdOrFail(orderId);
    return order.statusHistory;
  }

  /**
   * Find a single order by ID.
   */
  async findById(orderId: string): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id: orderId } });
  }

  /**
   * List orders filtered by role.
   * Farmer sees their orders, retailer sees their orders, admin sees all.
   */
  async findAll(filters: {
    farmerId?: string;
    retailerId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.orderRepository.createQueryBuilder('order');

    if (filters.farmerId) {
      qb.andWhere('order.farmerId = :farmerId', { farmerId: filters.farmerId });
    }

    if (filters.retailerId) {
      qb.andWhere('order.retailerId = :retailerId', { retailerId: filters.retailerId });
    }

    if (filters.status) {
      qb.andWhere('order.status = :status', { status: filters.status });
    }

    qb.orderBy('order.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  // ─── Private helpers ──────────────────────────────

  private async findByIdOrFail(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    return order;
  }

  private validateTransition(currentStatus: string, targetStatus: string): void {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(targetStatus)) {
      throw new UnprocessableEntityException(
        `Invalid state transition: ${currentStatus} -> ${targetStatus}. ` +
        `Allowed transitions from ${currentStatus}: ${allowed ? allowed.join(', ') : 'none'}`,
      );
    }
  }

  private generateOrderNumber(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = uuidv4().slice(0, 8).toUpperCase();
    return `ORD-${datePart}-${randomPart}`;
  }
}
