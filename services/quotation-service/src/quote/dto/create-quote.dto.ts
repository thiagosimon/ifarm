import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryMode, PaymentMethod } from '../schemas/quote.schema';

class ProductSnapshotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, {
    message:
      'tariffCode (NCM) must be exactly 8 digits (RCQ-001)',
  })
  tariffCode: string;

  @IsString()
  @IsNotEmpty()
  measurementUnit: string;
}

class QuoteItemDto {
  @IsMongoId()
  productId: string;

  @ValidateNested()
  @Type(() => ProductSnapshotDto)
  productSnapshot: ProductSnapshotDto;

  @IsNumber()
  @Min(0.01, { message: 'quantity must be greater than 0' })
  quantity: number;

  @IsString()
  @IsNotEmpty()
  measurementUnit: string;
}

class FarmerSnapshotDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  stateProvince: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

class GeoLocationDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsOptional()
  coordinates?: number[];
}

class DeliveryAddressDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  stateProvince?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @ValidateNested()
  @Type(() => GeoLocationDto)
  @IsOptional()
  location?: GeoLocationDto;
}

export class CreateQuoteDto {
  @IsMongoId()
  farmerId: string;

  @ValidateNested()
  @Type(() => FarmerSnapshotDto)
  farmerSnapshot: FarmerSnapshotDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item is required' })
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @IsEnum(DeliveryMode)
  deliveryMode: DeliveryMode;

  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  @IsOptional()
  deliveryAddress?: DeliveryAddressDto;

  @IsEnum(PaymentMethod)
  preferredPaymentMethod: PaymentMethod;

  @IsOptional()
  @IsNumber()
  @Min(1)
  expirationHours?: number;
}
