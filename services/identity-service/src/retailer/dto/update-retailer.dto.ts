import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ResponsiblePersonDto,
  RetailerAddressDto,
  PaymentAccountDto,
  ConsentItemDto,
} from './create-retailer.dto';

export class UpdateRetailerDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  businessName?: string;

  @IsString()
  @IsOptional()
  tradeName?: string;

  @ValidateNested()
  @Type(() => ResponsiblePersonDto)
  @IsOptional()
  responsiblePerson?: ResponsiblePersonDto;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[\d\s()-]{8,20}$/, {
    message: 'phoneNumber must be a valid phone number',
  })
  phoneNumber?: string;

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
  @ValidateNested({ each: true })
  @Type(() => ConsentItemDto)
  @IsOptional()
  consentHistory?: ConsentItemDto[];

  @IsString()
  @IsOptional()
  externalAuthId?: string;
}
