import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CustomerStatus } from '../schemas/customer.schema';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

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
  @IsString()
  retailerId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSpent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orders?: number;
}
