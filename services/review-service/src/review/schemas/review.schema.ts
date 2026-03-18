import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: String, required: true, unique: true, index: true })
  orderId: string;

  @Prop({ type: String, required: true, index: true })
  farmerId: string;

  @Prop({ type: String, required: true, index: true })
  retailerId: string;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  overallRating: number;

  @Prop({ type: Number, min: 1, max: 5, default: null })
  deliveryRating: number | null;

  @Prop({ type: Number, min: 1, max: 5, default: null })
  productQualityRating: number | null;

  @Prop({ type: Number, min: 1, max: 5, default: null })
  communicationRating: number | null;

  @Prop({ type: String, default: null, maxlength: 1000 })
  comment: string | null;

  @Prop({ type: Boolean, default: false })
  isModerationFlagged: boolean;

  @Prop({ type: Boolean, default: true })
  isPublished: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ retailerId: 1, isPublished: 1, createdAt: -1 });
ReviewSchema.index({ isModerationFlagged: 1, isPublished: 1 });
