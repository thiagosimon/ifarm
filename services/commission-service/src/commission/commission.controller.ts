import { Controller, Get, Query, Param, Res, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CommissionService } from './commission.service';
import {
  CalculateCommissionQueryDto,
  ExportCsvQueryDto,
  FinancialSummaryQueryDto,
} from './dto/commission.dto';

@Controller('commissions')
export class CommissionController {
  private readonly logger = new Logger(CommissionController.name);

  constructor(private readonly commissionService: CommissionService) {}

  /**
   * GET /v1/commissions
   * List all commissions (ADMIN).
   */
  @Get()
  async listCommissions(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.commissionService.findAll(page, limit);
  }

  /**
   * GET /v1/commissions/calculate
   * Internal endpoint used by payment-service to preview commission.
   */
  @Get('calculate')
  async calculateCommission(@Query() query: CalculateCommissionQueryDto) {
    const { totalAmount, transactionType } = query;
    const result = this.commissionService.calculateCommission(totalAmount, transactionType);
    return {
      totalAmount,
      transactionType: transactionType || 'PRODUCT',
      ...result,
    };
  }

  /**
   * GET /v1/commissions/export?startDate=&endDate=
   * Export commissions as CSV (ADMIN).
   */
  @Get('export')
  async exportCsv(@Query() query: ExportCsvQueryDto, @Res() res: Response) {
    const { startDate, endDate } = query;

    this.logger.log(`Exporting commissions CSV from ${startDate} to ${endDate}`);

    const csv = await this.commissionService.exportCsv(startDate, endDate);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=commissions_${startDate}_${endDate}.csv`,
    );
    res.status(HttpStatus.OK).send(csv);
  }
}

@Controller('retailers')
export class RetailerCommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  /**
   * GET /v1/retailers/:id/payouts
   * List payouts for a specific retailer (RETAILER).
   */
  @Get(':id/payouts')
  async getRetailerPayouts(
    @Param('id') retailerId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.commissionService.getRetailerPayouts(retailerId, page, limit);
  }

  /**
   * GET /v1/retailers/:id/financial-summary
   * Financial summary for a specific retailer (RETAILER).
   */
  @Get(':id/financial-summary')
  async getFinancialSummary(
    @Param('id') retailerId: string,
    @Query() query: FinancialSummaryQueryDto,
  ) {
    return this.commissionService.getFinancialSummary(
      retailerId,
      query.startDate,
      query.endDate,
    );
  }
}
