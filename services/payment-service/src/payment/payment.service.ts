import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { Transaction } from './entities/transaction.entity';
import { PagarmeAdapter, PagarmeCreateOrderRequest } from './pagarme.adapter';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly pagarmeAdapter: PagarmeAdapter,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  /**
   * Creates a charge for an order.
   * Consumes order.created event.
   * Calls commission-service HTTP to fetch commissionAmount.
   * Creates Pagar.me order with split rules configured BEFORE charge (RFN-003).
   * NEVER stores card PAN/CVV (RFN-005).
   * Idempotent by orderId.
   */
  async createCharge(payload: {
    orderId: string;
    orderNumber: string;
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
    customer?: {
      name: string;
      email: string;
      document: string;
      type?: 'individual' | 'company';
    };
    cardToken?: string;
    installments?: number;
  }): Promise<Transaction> {
    // Idempotency: check if transaction already exists for this order
    const existing = await this.transactionRepository.findOne({
      where: { orderId: payload.orderId },
    });

    if (existing) {
      this.logger.warn(
        `Transaction already exists for orderId=${payload.orderId}, returning existing`,
      );
      return existing;
    }

    // Fetch commission amount from commission-service
    let commissionAmount = payload.commissionAmount;
    try {
      const commissionServiceUrl =
        process.env.COMMISSION_SERVICE_URL || 'http://localhost:3005';
      const commissionResponse = await axios.get(
        `${commissionServiceUrl}/v1/commissions/calculate`,
        {
          params: {
            orderId: payload.orderId,
            totalAmount: payload.totalAmount,
            farmerId: payload.farmerId,
            retailerId: payload.retailerId,
          },
          timeout: 5000,
        },
      );
      commissionAmount = commissionResponse.data.commissionAmount;
      this.logger.log(
        `Commission for order ${payload.orderId}: ${commissionAmount}`,
      );
    } catch (err: any) {
      this.logger.warn(
        `Failed to fetch commission from commission-service: ${err.message}. Using provided commissionAmount=${commissionAmount}`,
      );
    }

    const totalAmountCents = Math.round(payload.totalAmount * 100);
    const commissionCents = Math.round(commissionAmount * 100);
    const retailerCents = totalAmountCents - commissionCents;

    // Build split rules (RFN-003: split configured BEFORE charge)
    const splitRules = [
      {
        amount: commissionCents,
        recipient_id: process.env.PAGARME_PLATFORM_RECIPIENT_ID || 'rp_platform',
        type: 'flat' as const,
        options: {
          charge_processing_fee: true,
          charge_remainder_fee: true,
          liable: true,
        },
      },
      {
        amount: retailerCents,
        recipient_id: payload.retailerId,
        type: 'flat' as const,
        options: {
          charge_processing_fee: false,
          charge_remainder_fee: false,
          liable: false,
        },
      },
    ];

    // Build Pagar.me payment method config
    const method = payload.paymentMethod.toUpperCase();
    const paymentConfig: any = {
      payment_method: this.toPagarmeMethod(method),
      amount: totalAmountCents,
      split: splitRules,
    };

    if (method === 'PIX') {
      paymentConfig.pix = {
        expires_in: 7200, // 2 hours
      };
    } else if (method === 'BOLETO') {
      // 3 business days from now
      const dueDate = this.addBusinessDays(new Date(), 3);
      paymentConfig.boleto = {
        due_at: dueDate.toISOString(),
        instructions: `Pagamento referente ao pedido ${payload.orderNumber}`,
      };
    } else if (method === 'CREDIT_CARD') {
      // RFN-005: NEVER store card PAN/CVV. Only use cardToken.
      if (!payload.cardToken) {
        throw new BadRequestException(
          'cardToken is required for credit card payments',
        );
      }
      paymentConfig.credit_card = {
        card_token: payload.cardToken,
        installments: payload.installments || 1,
        statement_descriptor: 'IFARM',
      };
    }

    // Build Pagar.me order request
    const pagarmeRequest: PagarmeCreateOrderRequest = {
      items: payload.items.map((item) => ({
        amount: Math.round(item.totalPrice * 100),
        description: item.name,
        quantity: item.quantity,
        code: item.productId,
      })),
      customer: payload.customer || {
        name: 'iFarm Customer',
        email: 'customer@ifarm.com.br',
        document: '00000000000',
        type: 'individual',
      },
      payments: [paymentConfig],
    };

    // Create order in Pagar.me
    const pagarmeResponse = await this.pagarmeAdapter.createOrder(pagarmeRequest);

    const charge = pagarmeResponse.charges?.[0];
    const lastTxn = charge?.last_transaction;

    // Create local transaction record
    const transaction = this.transactionRepository.create({
      orderId: payload.orderId,
      pagarmeTransactionId: pagarmeResponse.id,
      farmerId: payload.farmerId,
      retailerId: payload.retailerId,
      amount: payload.totalAmount,
      commissionAmount,
      method,
      status: 'PENDING',
      splitRules,
      // PIX-specific fields
      pixQrCode: lastTxn?.qr_code || null,
      pixExpiration: lastTxn?.expires_at ? new Date(lastTxn.expires_at) : null,
      // Boleto-specific fields
      boletoUrl: lastTxn?.url || null,
      boletoBarcode: lastTxn?.barcode || null,
      boletoExpiration: lastTxn?.due_at ? new Date(lastTxn.due_at) : null,
      // Card-specific fields (RFN-005: only store last four + brand)
      lastFourDigits: lastTxn?.card?.last_four_digits || null,
      cardBrand: lastTxn?.card?.brand || null,
    });

    const saved = await this.transactionRepository.save(transaction);
    this.logger.log(
      `Transaction created: ${saved.id} for orderId=${payload.orderId}, method=${method}`,
    );

    // Publish method-specific event
    if (method === 'PIX') {
      await this.rabbitmqService.publish('payment.pix.pending', {
        orderId: saved.orderId,
        transactionId: saved.id,
        pagarmeTransactionId: saved.pagarmeTransactionId,
        pixQrCode: saved.pixQrCode,
        pixExpiration: saved.pixExpiration,
      });
    } else if (method === 'BOLETO') {
      await this.rabbitmqService.publish('payment.boleto.created', {
        orderId: saved.orderId,
        transactionId: saved.id,
        pagarmeTransactionId: saved.pagarmeTransactionId,
        boletoUrl: saved.boletoUrl,
        boletoBarcode: saved.boletoBarcode,
        boletoExpiration: saved.boletoExpiration,
      });
    } else if (method === 'CREDIT_CARD') {
      // Credit card charges may be approved immediately
      if (charge?.status === 'paid') {
        saved.status = 'PAID';
        saved.paidAt = new Date();
        await this.transactionRepository.save(saved);
        await this.rabbitmqService.publish('payment.confirmed', {
          orderId: saved.orderId,
          transactionId: saved.id,
          pagarmeTransactionId: saved.pagarmeTransactionId,
          method: saved.method,
          amount: saved.amount,
        });
      }
    }

    return saved;
  }

  /**
   * Process Pagar.me webhook.
   * POST /v1/webhooks/pagarme
   * Validates HMAC SHA256 (RSD-004).
   * Always returns 200.
   * Idempotent by pagarmeTransactionId (RFN-004).
   */
  async processWebhook(
    rawBody: string,
    signature: string,
    payload: any,
  ): Promise<{ received: true }> {
    // Validate HMAC SHA256 signature (RSD-004)
    const secret = process.env.PAGARME_WEBHOOK_SECRET || '';
    if (secret) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        this.logger.warn('Invalid webhook signature, ignoring');
        return { received: true }; // Always return 200
      }
    }

    const eventType = payload.type;
    const pagarmeOrderId = payload.data?.id;

    if (!pagarmeOrderId) {
      this.logger.warn('Webhook payload missing data.id, ignoring');
      return { received: true };
    }

    // Find the local transaction
    const transaction = await this.transactionRepository.findOne({
      where: { pagarmeTransactionId: pagarmeOrderId },
    });

    if (!transaction) {
      this.logger.warn(
        `No transaction found for pagarmeTransactionId=${pagarmeOrderId}, ignoring webhook`,
      );
      return { received: true };
    }

    // Idempotent checks (RFN-004)
    if (eventType === 'order.paid' || eventType === 'charge.paid') {
      if (transaction.status === 'PAID') {
        this.logger.warn(
          `Transaction ${transaction.id} already PAID, idempotent skip`,
        );
        return { received: true };
      }

      transaction.status = 'PAID';
      transaction.paidAt = new Date();
      await this.transactionRepository.save(transaction);

      this.logger.log(`Transaction ${transaction.id} marked as PAID via webhook`);

      await this.rabbitmqService.publish('payment.confirmed', {
        orderId: transaction.orderId,
        transactionId: transaction.id,
        pagarmeTransactionId: transaction.pagarmeTransactionId,
        method: transaction.method,
        amount: transaction.amount,
      });
    } else if (
      eventType === 'order.payment_failed' ||
      eventType === 'charge.payment_failed'
    ) {
      if (transaction.status === 'FAILED') {
        this.logger.warn(
          `Transaction ${transaction.id} already FAILED, idempotent skip`,
        );
        return { received: true };
      }

      transaction.status = 'FAILED';
      transaction.failedAt = new Date();
      transaction.failureReason =
        payload.data?.charges?.[0]?.last_transaction?.gateway_response?.errors?.[0]?.message ||
        'Payment failed';
      await this.transactionRepository.save(transaction);

      this.logger.log(`Transaction ${transaction.id} marked as FAILED via webhook`);

      await this.rabbitmqService.publish('payment.failed', {
        orderId: transaction.orderId,
        transactionId: transaction.id,
        pagarmeTransactionId: transaction.pagarmeTransactionId,
        reason: transaction.failureReason,
      });
    } else {
      this.logger.debug(`Ignoring webhook event type: ${eventType}`);
    }

    return { received: true };
  }

  /**
   * Refund a payment.
   * Called by order-service for cancellations (RFN-006).
   */
  async refund(orderId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { orderId },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction not found for orderId=${orderId}`);
    }

    if (transaction.status === 'REFUNDED') {
      this.logger.warn(
        `Transaction ${transaction.id} already REFUNDED, idempotent skip`,
      );
      return transaction;
    }

    if (transaction.status !== 'PAID') {
      throw new UnprocessableEntityException(
        `Cannot refund transaction in status ${transaction.status}. Only PAID transactions can be refunded.`,
      );
    }

    // Refund via Pagar.me
    try {
      await this.pagarmeAdapter.refundCharge(transaction.pagarmeTransactionId);
    } catch (err: any) {
      this.logger.error(
        `Failed to refund via Pagar.me for transaction ${transaction.id}: ${err.message}`,
      );
      throw new UnprocessableEntityException(
        'Failed to process refund with payment provider',
      );
    }

    transaction.status = 'REFUNDED';
    transaction.refundedAt = new Date();
    const saved = await this.transactionRepository.save(transaction);

    this.logger.log(`Transaction ${saved.id} refunded for orderId=${orderId}`);

    await this.rabbitmqService.publish('payment.refunded', {
      orderId: saved.orderId,
      transactionId: saved.id,
      pagarmeTransactionId: saved.pagarmeTransactionId,
      amount: saved.amount,
    });

    return saved;
  }

  /**
   * Get transaction by orderId.
   */
  async findByOrderId(orderId: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { orderId } });
  }

  // ─── Private helpers ──────────────────────────────

  private toPagarmeMethod(method: string): 'pix' | 'boleto' | 'credit_card' {
    switch (method) {
      case 'PIX':
        return 'pix';
      case 'BOLETO':
        return 'boleto';
      case 'CREDIT_CARD':
        return 'credit_card';
      default:
        throw new BadRequestException(`Unsupported payment method: ${method}`);
    }
  }

  /**
   * Adds business days to a date (skips weekends).
   */
  private addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }
    return result;
  }
}
