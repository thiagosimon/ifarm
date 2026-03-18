import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceRegionDto {
  @IsString()
  @IsNotEmpty()
  stateProvince: string;
}

export class CustomAttributeDto {
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

export class AddToRetailerCatalogDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  availableStock: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  minimumOrderQuantity?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceRegionDto)
  @IsOptional()
  serviceRegions?: ServiceRegionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomAttributeDto)
  @IsOptional()
  customAttributes?: CustomAttributeDto[];
}

export class UpdateRetailerProductDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  availableStock?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  minimumOrderQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceRegionDto)
  @IsOptional()
  serviceRegions?: ServiceRegionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomAttributeDto)
  @IsOptional()
  customAttributes?: CustomAttributeDto[];
}
