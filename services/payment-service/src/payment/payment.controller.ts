import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Req,
  Logger,
  RawBodyRequest,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /v1/webhooks/pagarme
   * Public endpoint. Validates HMAC SHA256 signature.
   * Always returns 200.
   */
  @Post('webhooks/pagarme')
  @HttpCode(200)
  async processWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-hub-signature') signature: string,
    @Body() body: any,
  ) {
    const rawBody =
      req.rawBody?.toString('utf-8') || JSON.stringify(body);

    return this.paymentService.processWebhook(rawBody, signature || '', body);
  }

  /**
   * GET /v1/payments/:orderId
   * Returns the transaction for a given order.
   */
  @Get('payments/:orderId')
  async findByOrderId(@Param('orderId') orderId: string) {
    const transaction = await this.paymentService.findByOrderId(orderId);
    if (!transaction) {
      return { statusCode: 404, message: `No payment found for order ${orderId}` };
    }
    return transaction;
  }

  /**
   * POST /v1/payments/:orderId/refund
   * Called by order-service for cancellations.
   */
  @Post('payments/:orderId/refund')
  async refund(@Param('orderId') orderId: string) {
    return this.paymentService.refund(orderId);
  }
}
