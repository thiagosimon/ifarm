import {
  IsBoolean,
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
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecurringFrequency } from '../schemas/recurring-config.schema';

class RecurringProductSnapshotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, {
    message: 'tariffCode (NCM) must be exactly 8 digits (RCQ-001)',
  })
  tariffCode: string;
}

export class CreateRecurringDto {
  @IsMongoId()
  farmerId: string;

  @IsMongoId()
  productId: string;

  @ValidateNested()
  @Type(() => RecurringProductSnapshotDto)
  productSnapshot: RecurringProductSnapshotDto;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  measurementUnit: string;

  @IsEnum(RecurringFrequency)
  frequency: RecurringFrequency;

  @IsNumber()
  @IsOptional()
  @Min(1)
  customIntervalDays?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxAcceptPrice?: number;

  @IsBoolean()
  @IsOptional()
  autoAccept?: boolean;

  @IsString()
  @IsNotEmpty()
  deliveryMode: string;

  @IsObject()
  @IsOptional()
  deliveryAddress?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  preferredPaymentMethod: string;
}

export class UpdateRecurringDto {
  @IsEnum(RecurringFrequency)
  @IsOptional()
  frequency?: RecurringFrequency;

  @IsNumber()
  @IsOptional()
  @Min(1)
  customIntervalDays?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  quantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxAcceptPrice?: number;

  @IsBoolean()
  @IsOptional()
  autoAccept?: boolean;

  @IsString()
  @IsOptional()
  status?: string;
}
