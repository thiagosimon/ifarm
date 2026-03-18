import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProposalItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}

class RetailerSnapshotDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  tradeName: string;

  @IsNumber()
  @IsOptional()
  avgRating?: number;

  @IsString()
  @IsNotEmpty()
  stateProvince: string;
}

export class CreateProposalDto {
  @IsMongoId()
  retailerId: string;

  @ValidateNested()
  @Type(() => RetailerSnapshotDto)
  retailerSnapshot: RetailerSnapshotDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProposalItemDto)
  items: ProposalItemDto[];

  @IsNumber()
  @Min(0)
  subtotalAmount: number;

  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @IsNumber()
  @Min(1)
  deliveryDays: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  paymentMethods: string[];

  @IsString()
  @IsOptional()
  observations?: string;
}
