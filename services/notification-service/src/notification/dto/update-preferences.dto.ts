import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuietHoursDto {
  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;
}

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  isPushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isWhatsappEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmailEnabled?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => QuietHoursDto)
  quietHours?: QuietHoursDto;

  @IsOptional()
  @IsString()
  timezone?: string;
}
