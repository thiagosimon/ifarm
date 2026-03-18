import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Headers,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { DispatchOrderDto, DisputeOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  /**
   * GET /v1/orders
   * Farmer sees their orders, retailer sees theirs, admin sees all.
   * Role/user info comes from x-user-id and x-user-role headers (set by API gateway).
   */
  @Get()
  async findAll(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const filters: {
      farmerId?: string;
      retailerId?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = { status, page, limit };

    if (userRole === 'FARMER') {
      filters.farmerId = userId;
    } else if (userRole === 'RETAILER') {
      filters.retailerId = userId;
    }
    // ADMIN sees all (no filter)

    return this.orderService.findAll(filters);
  }

  /**
   * GET /v1/orders/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.orderService.findById(id);
    if (!order) {
      return { statusCode: 404, message: `Order ${id} not found` };
    }
    return order;
  }

  /**
   * GET /v1/orders/:id/timeline
   * Returns the status history of an order.
   */
  @Get(':id/timeline')
  async getTimeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.getTimeline(id);
  }

  /**
   * PATCH /v1/orders/:id/dispatch
   * Retailer dispatches the order with a tracking code.
   */
  @Patch(':id/dispatch')
  async dispatch(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: DispatchOrderDto,
  ) {
    return this.orderService.dispatch(id, userId, dto.trackingCode);
  }

  /**
   * POST /v1/orders/:id/confirm-delivery
   * Farmer confirms delivery.
   */
  @Post(':id/confirm-delivery')
  async confirmDelivery(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.orderService.confirmDelivery(id, userId);
  }

  /**
   * POST /v1/orders/:id/dispute
   * Farmer disputes an order (within 7 days of delivery, reason min 20 chars).
   */
  @Post(':id/dispute')
  async dispute(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: DisputeOrderDto,
  ) {
    return this.orderService.dispute(id, userId, dto.reason);
  }

  /**
   * POST /v1/orders/:id/cancel
   * Admin cancels an order (only AWAITING_PAYMENT or PAID).
   */
  @Post(':id/cancel')
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.orderService.cancel(id, userId);
  }
}
