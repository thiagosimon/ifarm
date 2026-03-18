import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CalculateTaxDto } from './dto/calculate-tax.dto';

@Controller('tax')
export class TaxController {
  private readonly logger = new Logger(TaxController.name);

  constructor(private readonly taxService: TaxService) {}

  /**
   * POST /v1/tax/calculate
   *
   * Calculate ICMS, DIFAL, and Tax Substitution for a given product/transaction.
   */
  @Post('calculate')
  async calculateTax(@Body() dto: CalculateTaxDto) {
    this.logger.log(
      `Calculating tax for tariff ${dto.tariffCode}: ` +
        `${dto.originStateProvince} -> ${dto.destinationStateProvince}, ` +
        `buyer: ${dto.buyerType}, amount: ${dto.subtotalAmount}`,
    );

    return this.taxService.calculateTax(dto);
  }
}
