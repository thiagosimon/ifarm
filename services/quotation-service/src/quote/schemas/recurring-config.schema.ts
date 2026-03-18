import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum RecurringFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

export enum RecurringStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
}

export type RecurringConfigDocument = RecurringConfig & Document;

@Schema({ timestamps: true, collection: 'recurring_configs' })
export class RecurringConfig {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  farmerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop(
    raw({
      name: { type: String, required: true },
      category: { type: String, required: true },
      tariffCode: { type: String, required: true },
    }),
  )
  productSnapshot: {
    name: string;
    category: string;
    tariffCode: string;
  };

  @Prop({ type: Number, required: true, min: 0 })
  quantity: number;

  @Prop({ type: String, required: true })
  measurementUnit: string;

  @Prop({
    type: String,
    enum: RecurringFrequency,
    required: true,
  })
  frequency: RecurringFrequency;

  @Prop({ type: Number, default: null })
  customIntervalDays?: number | null;

  @Prop({ type: Number, default: null })
  maxAcceptPrice?: number | null;

  @Prop({ type: Boolean, default: false })
  autoAccept: boolean;

  @Prop({
    type: String,
    enum: RecurringStatus,
    default: RecurringStatus.ACTIVE,
    index: true,
  })
  status: RecurringStatus;

  @Prop({ type: Date, required: true, index: true })
  nextFireAt: Date;

  @Prop({ type: String, required: true })
  deliveryMode: string;

  @Prop({ type: Object, default: null })
  deliveryAddress?: Record<string, any>;

  @Prop({ type: String, required: true })
  preferredPaymentMethod: string;
}

export const RecurringConfigSchema =
  SchemaFactory.createForClass(RecurringConfig);

RecurringConfigSchema.index({ status: 1, nextFireAt: 1 });
RecurringConfigSchema.index({ farmerId: 1, status: 1 });
