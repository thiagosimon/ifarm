import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class DispatchOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'trackingCode is required' })
  trackingCode: string;
}

export class DisputeOrderDto {
  @IsString()
  @MinLength(20, { message: 'Dispute reason must be at least 20 characters' })
  reason: string;
}
