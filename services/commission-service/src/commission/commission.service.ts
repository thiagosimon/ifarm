import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Commission } from './entities/commission.entity';
import { addBusinessDays } from './helpers/business-days';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

export interface CommissionCalculation {
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
}

export interface FinancialSummary {
  gmv: number;
  totalCommissions: number;
  totalNet: number;
  count: number;
  period: { startDate: string; endDate: string };
}

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
    @InjectQueue('holdback-release')
    private readonly holdbackQueue: Queue,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  /**
   * RFN-001: Commission on TOTAL amount (with taxes).
   * Rates:
   *   - < R$10k       -> 5%
   *   - R$10k - R$100k -> 3.5%
   *   - > R$100k      -> 2%
   *   - Services       -> 8%
   */
  calculateCommissionRate(totalAmount: number, transactionType?: string): number {
    if (transactionType && transactionType.toUpperCase() === 'SERVICE') {
      return 0.08;
    }

    if (totalAmount < 10_000) {
      return 0.05;
    }

    if (totalAmount <= 100_000) {
      return 0.035;
    }

    return 0.02;
  }

  /**
   * RFN-002: 7 business days excluding weekends and Brazilian national holidays.
   */
  calculateHoldbackDate(deliveredAt: Date): Date {
    return addBusinessDays(deliveredAt, 7);
  }

  /**
   * Calculate commission amounts for a given total.
   */
  calculateCommission(totalAmount: number, transactionType?: string): CommissionCalculation {
    const rate = this.calculateCommissionRate(totalAmount, transactionType);
    const commissionAmount = parseFloat((totalAmount * rate).toFixed(2));
    const netAmount = parseFloat((totalAmount - commissionAmount).toFixed(2));

    return {
      commissionRate: rate,
      commissionAmount,
      netAmount,
    };
  }

  /**
   * Create a commission record when an order is delivered.
   * Schedules a BullMQ delayed job for holdback release.
   */
  async createCommission(data: {
    orderId: string;
    retailerId: string;
    farmerId: string;
    orderTotalAmount: number;
    transactionType?: string;
    deliveredAt?: string;
  }): Promise<Commission> {
    const { orderId, retailerId, farmerId, orderTotalAmount, transactionType, deliveredAt } = data;

    this.logger.log(`Creating commission for order ${orderId}`);

    const existing = await this.commissionRepository.findOne({ where: { orderId } });
    if (existing) {
      this.logger.warn(`Commission already exists for order ${orderId}, returning existing`);
      return existing;
    }

    const { commissionRate, commissionAmount, netAmount } = this.calculateCommission(
      orderTotalAmount,
      transactionType,
    );

    const deliveredDate = deliveredAt ? new Date(deliveredAt) : new Date();
    const holdbackReleaseAt = this.calculateHoldbackDate(deliveredDate);

    const commission = this.commissionRepository.create({
      orderId,
      retailerId,
      farmerId,
      orderTotalAmount,
      commissionRate,
      commissionAmount,
      netAmount,
      status: 'PENDING',
      holdbackReleaseAt,
    });

    const saved = await this.commissionRepository.save(commission);

    // Schedule delayed holdback release job
    const delay = holdbackReleaseAt.getTime() - Date.now();
    const effectiveDelay = Math.max(delay, 0);

    await this.holdbackQueue.add(
      'release',
      { commissionId: saved.id },
      {
        delay: effectiveDelay,
        jobId: `holdback-${saved.id}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );

    this.logger.log(
      `Commission ${saved.id} created for order ${orderId}. ` +
        `Rate: ${(commissionRate * 100).toFixed(2)}%, Amount: ${commissionAmount}, ` +
        `Holdback release at: ${holdbackReleaseAt.toISOString()}`,
    );

    return saved;
  }

  /**
   * Release a commission after the holdback period.
   * Updates the status to RELEASED and publishes commission.released event.
   */
  async releaseCommission(commissionId: string): Promise<Commission> {
    const commission = await this.commissionRepository.findOne({ where: { id: commissionId } });
    if (!commission) {
      throw new Error(`Commission ${commissionId} not found`);
    }

    if (commission.status === 'RELEASED') {
      this.logger.warn(`Commission ${commissionId} already released`);
      return commission;
    }

    if (commission.status === 'CANCELLED') {
      this.logger.warn(`Commission ${commissionId} is cancelled, skipping release`);
      return commission;
    }

    commission.status = 'RELEASED';
    commission.releasedAt = new Date();

    const updated = await this.commissionRepository.save(commission);

    // Publish commission.released event via RabbitMQ
    await this.rabbitmqService.publish('commission.released', {
      commissionId: updated.id,
      orderId: updated.orderId,
      retailerId: updated.retailerId,
      farmerId: updated.farmerId,
      commissionAmount: updated.commissionAmount,
      netAmount: updated.netAmount,
      releasedAt: updated.releasedAt.toISOString(),
    });

    this.logger.log(
      `Commission ${commissionId} released. Net payout: ${updated.netAmount}`,
    );

    return updated;
  }

  /**
   * List payouts for a specific retailer.
   */
  async getRetailerPayouts(
    retailerId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Commission[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.commissionRepository.findAndCount({
      where: { retailerId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  /**
   * Get financial summary (GMV, commissions, net) by period for a retailer.
   */
  async getFinancialSummary(
    retailerId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<FinancialSummary> {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const commissions = await this.commissionRepository.find({
      where: {
        retailerId,
        createdAt: Between(start, end),
      },
    });

    const gmv = commissions.reduce(
      (sum, c) => sum + parseFloat(String(c.orderTotalAmount)),
      0,
    );
    const totalCommissions = commissions.reduce(
      (sum, c) => sum + parseFloat(String(c.commissionAmount)),
      0,
    );
    const totalNet = commissions.reduce(
      (sum, c) => sum + parseFloat(String(c.netAmount)),
      0,
    );

    return {
      gmv: parseFloat(gmv.toFixed(2)),
      totalCommissions: parseFloat(totalCommissions.toFixed(2)),
      totalNet: parseFloat(totalNet.toFixed(2)),
      count: commissions.length,
      period: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      },
    };
  }

  /**
   * Export commissions as CSV for admin.
   */
  async exportCsv(startDate: string, endDate: string): Promise<string> {
    const commissions = await this.commissionRepository.find({
      where: {
        createdAt: Between(new Date(startDate), new Date(endDate)),
      },
      order: { createdAt: 'ASC' },
    });

    const header = [
      'id',
      'orderId',
      'retailerId',
      'farmerId',
      'orderTotalAmount',
      'commissionRate',
      'commissionAmount',
      'netAmount',
      'status',
      'holdbackReleaseAt',
      'releasedAt',
      'payoutId',
      'transactionId',
      'createdAt',
      'updatedAt',
    ].join(',');

    const rows = commissions.map((c) =>
      [
        c.id,
        c.orderId,
        c.retailerId,
        c.farmerId,
        c.orderTotalAmount,
        c.commissionRate,
        c.commissionAmount,
        c.netAmount,
        c.status,
        c.holdbackReleaseAt ? c.holdbackReleaseAt.toISOString() : '',
        c.releasedAt ? c.releasedAt.toISOString() : '',
        c.payoutId || '',
        c.transactionId || '',
        c.createdAt.toISOString(),
        c.updatedAt.toISOString(),
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }

  /**
   * Find a commission by its ID.
   */
  async findById(commissionId: string): Promise<Commission | null> {
    return this.commissionRepository.findOne({ where: { id: commissionId } });
  }

  /**
   * List all commissions with pagination (admin).
   */
  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{ data: Commission[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.commissionRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }
}
