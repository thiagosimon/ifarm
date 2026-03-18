import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../schemas/product.schema';
import { ProductAttributeDto } from './create-product.dto';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsString()
  @IsOptional()
  @Matches(/^\d{8}$/, {
    message: 'tariffCode must be exactly 8 digits (RCQ-001)',
  })
  tariffCode?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{7}$/, {
    message: 'cestCode must be exactly 7 digits',
  })
  cestCode?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, {
    message: 'cfopCode must be exactly 4 digits',
  })
  cfopCode?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-8]$/, {
    message: 'originCode must be a single digit 0-8',
  })
  originCode?: string;

  @IsBoolean()
  @IsOptional()
  isRuralCreditEligible?: boolean;

  @IsString()
  @IsOptional()
  measurementUnit?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes?: ProductAttributeDto[];

  @IsString()
  @IsOptional()
  @Matches(/^(ACTIVE|INACTIVE|DRAFT)$/, {
    message: 'status must be ACTIVE, INACTIVE, or DRAFT',
  })
  status?: string;
}
