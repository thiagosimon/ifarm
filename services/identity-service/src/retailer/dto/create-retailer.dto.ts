import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResponsiblePersonDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  role?: string;
}

export class RetailerAddressDto {
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

export class PaymentAccountDto {
  @IsString()
  @IsOptional()
  bankCode?: string;

  @IsString()
  @IsOptional()
  branchNumber?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;
}

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

export class CreateRetailerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  businessName: string;

  @IsString()
  @IsOptional()
  tradeName?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, {
    message: 'businessRegistrationId must be a valid CNPJ (14 digits)',
  })
  businessRegistrationId: string;

  @ValidateNested()
  @Type(() => ResponsiblePersonDto)
  @IsNotEmpty()
  responsiblePerson: ResponsiblePersonDto;

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
  @IsOptional()
  externalAuthId?: string;

  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @ValidateNested()
  @Type(() => RetailerAddressDto)
  @IsOptional()
  address?: RetailerAddressDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceRegions?: string[];

  @ValidateNested()
  @Type(() => PaymentAccountDto)
  @IsOptional()
  paymentAccount?: PaymentAccountDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one consent record is required (RLGPD-001)' })
  @ValidateNested({ each: true })
  @Type(() => ConsentItemDto)
  consentHistory: ConsentItemDto[];
}
