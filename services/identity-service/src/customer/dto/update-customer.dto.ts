import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CustomerStatus } from '../schemas/customer.schema';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSpent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orders?: number;
}
