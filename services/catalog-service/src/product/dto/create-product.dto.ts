import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateNested,
  Matches,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../schemas/product.schema';

export class ProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsEnum(ProductCategory, {
    message: `category must be one of: ${Object.values(ProductCategory).join(', ')}`,
  })
  @IsNotEmpty()
  category: ProductCategory;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, {
    message: 'tariffCode must be exactly 8 digits (RCQ-001)',
  })
  tariffCode: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{7}$/, {
    message: 'cestCode must be exactly 7 digits',
  })
  cestCode?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, {
    message: 'cfopCode must be exactly 4 digits',
  })
  cfopCode: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-8]$/, {
    message: 'originCode must be a single digit 0-8',
  })
  originCode: string;

  @IsBoolean()
  isRuralCreditEligible: boolean;

  @IsString()
  @IsNotEmpty()
  measurementUnit: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes?: ProductAttributeDto[];
}
