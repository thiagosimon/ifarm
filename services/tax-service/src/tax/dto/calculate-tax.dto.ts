import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum BuyerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export class CalculateTaxDto {
  @IsString()
  tariffCode: string;

  @IsString()
  originStateProvince: string;

  @IsString()
  destinationStateProvince: string;

  @IsEnum(BuyerType)
  buyerType: BuyerType;

  @IsNumber()
  subtotalAmount: number;
}

export class TaxCalculationResult {
  stateSalesTaxType: string;
  stateSalesTaxRate: number;
  stateSalesTaxAmount: number;
  interstateVatDifferential: number;
  taxSubstitutionAmount: number;
  legalBasis: string;
  totalWithTax: number;
  calculatedAt: string;
}
