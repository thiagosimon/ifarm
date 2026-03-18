import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateCommissionDto {
  @IsString()
  orderId: string;

  @IsString()
  retailerId: string;

  @IsString()
  farmerId: string;

  @IsNumber()
  orderTotalAmount: number;

  @IsString()
  @IsOptional()
  transactionType?: string;

  @IsDateString()
  @IsOptional()
  deliveredAt?: string;
}

export class CalculateCommissionQueryDto {
  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsOptional()
  transactionType?: string;
}

export class ExportCsvQueryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class FinancialSummaryQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
