import {
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FarmAddressDto, ConsentItemDto } from './create-farmer.dto';

export class UpdateFarmerDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  fullName?: string;

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

  @IsString()
  @IsOptional()
  farmName?: string;

  @ValidateNested()
  @Type(() => FarmAddressDto)
  @IsOptional()
  farmAddress?: FarmAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsentItemDto)
  @IsOptional()
  consentHistory?: ConsentItemDto[];

  @IsString()
  @IsOptional()
  externalAuthId?: string;
}
