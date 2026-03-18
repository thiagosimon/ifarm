import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewEligibilityDocument = ReviewEligibility & Document;

@Schema({ timestamps: true, collection: 'review_eligibilities' })
export class ReviewEligibility {
  @Prop({ type: String, required: true, unique: true, index: true })
  orderId: string;

  @Prop({ type: String, required: true, index: true })
  farmerId: string;

  @Prop({ type: String, required: true, index: true })
  retailerId: string;

  @Prop({ type: Boolean, default: true })
  isEligible: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date, default: null })
  reviewedAt: Date | null;
}

export const ReviewEligibilitySchema =
  SchemaFactory.createForClass(ReviewEligibility);

ReviewEligibilitySchema.index({ expiresAt: 1 });
ReviewEligibilitySchema.index({ farmerId: 1, isEligible: 1 });
