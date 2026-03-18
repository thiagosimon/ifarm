import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
  IsIP,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ConsentItemDto {
  @IsDateString()
  @IsNotEmpty()
  acceptedAt: string;

  @IsString()
  @IsNotEmpty()
  termsVersion: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class FarmAddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

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
}

export class CreateFarmerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[\d\s()-]{8,20}$/, {
    message: 'phoneNumber must be a valid phone number',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'federalTaxId must be a valid CPF (11 digits) or CNPJ (14 digits)',
  })
  federalTaxId: string;

  @IsString()
  @IsOptional()
  externalAuthId?: string;

  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsOptional()
  farmName?: string;

  @ValidateNested()
  @Type(() => FarmAddressDto)
  @IsOptional()
  farmAddress?: FarmAddressDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one consent record is required (RLGPD-001)' })
  @ValidateNested({ each: true })
  @Type(() => ConsentItemDto)
  consentHistory: ConsentItemDto[];
}
