import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, default: null })
  phone: string | null;

  @Prop({ type: String, default: null })
  city: string | null;

  @Prop({ type: String, default: null })
  state: string | null;

  @Prop({ enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @Prop({ type: String, default: null })
  retailerId: string | null;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: 0 })
  orders: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
