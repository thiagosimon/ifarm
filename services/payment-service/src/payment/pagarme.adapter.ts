import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

export interface PagarmeCreateOrderRequest {
  items: Array<{
    amount: number; // cents
    description: string;
    quantity: number;
    code: string;
  }>;
  customer: {
    name: string;
    email: string;
    document: string;
    type: 'individual' | 'company';
  };
  payments: Array<{
    payment_method: 'pix' | 'boleto' | 'credit_card';
    pix?: {
      expires_in: number; // seconds
    };
    boleto?: {
      due_at: string; // ISO date
      instructions: string;
    };
    credit_card?: {
      card_token: string;
      installments: number;
      statement_descriptor: string;
    };
    amount: number; // cents
    split?: Array<{
      amount: number;
      recipient_id: string;
      type: 'percentage' | 'flat';
      options: {
        charge_processing_fee: boolean;
        charge_remainder_fee: boolean;
        liable: boolean;
      };
    }>;
  }>;
}

export interface PagarmeOrderResponse {
  id: string;
  code: string;
  amount: number;
  currency: string;
  status: string;
  charges: Array<{
    id: string;
    code: string;
    amount: number;
    status: string;
    payment_method: string;
    last_transaction: {
      id: string;
      transaction_type: string;
      amount: number;
      status: string;
      qr_code?: string;
      qr_code_url?: string;
      expires_at?: string;
      url?: string;
      barcode?: string;
      due_at?: string;
      card?: {
        last_four_digits: string;
        brand: string;
      };
    };
  }>;
  created_at: string;
}

export interface PagarmeRefundResponse {
  id: string;
  charge_id: string;
  amount: number;
  status: string;
  created_at: string;
}

@Injectable()
export class PagarmeAdapter {
  private readonly logger = new Logger(PagarmeAdapter.name);
  private readonly client: AxiosInstance;

  constructor() {
    const apiKey = process.env.PAGARME_API_KEY || '';
    const baseURL = process.env.PAGARME_BASE_URL || 'https://api.pagar.me';

    // Basic auth: api_key as username, empty password
    const auth = Buffer.from(`${apiKey}:`).toString('base64');

    this.client = axios.create({
      baseURL: `${baseURL}/core/v5`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      timeout: 30000,
    });

    // Configure axios-retry: 3 attempts with exponential backoff for 5xx only
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: (retryCount: number) => {
        const delays = [1000, 3000, 10000];
        return delays[retryCount - 1] || 10000;
      },
      retryCondition: (error: any) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response && error.response.status >= 500)
        );
      },
      onRetry: (retryCount: number, error: any) => {
        this.logger.warn(
          `Pagar.me API retry #${retryCount}: ${error.message}`,
        );
      },
    });
  }

  /**
   * Create an order in Pagar.me v5.
   * POST /core/v5/orders
   */
  async createOrder(
    request: PagarmeCreateOrderRequest,
  ): Promise<PagarmeOrderResponse> {
    this.logger.debug('Creating Pagar.me order');

    try {
      const response = await this.client.post<PagarmeOrderResponse>(
        '/orders',
        request,
      );
      this.logger.log(`Pagar.me order created: ${response.data.id}`);
      return response.data;
    } catch (err: any) {
      const errorData = err.response?.data;
      this.logger.error(
        `Pagar.me createOrder failed: ${err.message}`,
        errorData ? JSON.stringify(errorData) : '',
      );
      throw err;
    }
  }

  /**
   * Refund a charge in Pagar.me v5.
   * POST /core/v5/charges/{chargeId}/refund
   */
  async refundCharge(
    chargeId: string,
    amount?: number,
  ): Promise<PagarmeRefundResponse> {
    this.logger.debug(`Refunding Pagar.me charge ${chargeId}`);

    try {
      const body: any = {};
      if (amount) {
        body.amount = amount;
      }

      const response = await this.client.post<PagarmeRefundResponse>(
        `/charges/${chargeId}/refund`,
        body,
      );
      this.logger.log(`Pagar.me charge ${chargeId} refunded`);
      return response.data;
    } catch (err: any) {
      const errorData = err.response?.data;
      this.logger.error(
        `Pagar.me refund failed for charge ${chargeId}: ${err.message}`,
        errorData ? JSON.stringify(errorData) : '',
      );
      throw err;
    }
  }
}
