import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  orderId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  deliveryRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  productQualityRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  communicationRating?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
