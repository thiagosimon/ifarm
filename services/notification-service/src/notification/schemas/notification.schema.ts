import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RecipientType {
  FARMER = 'FARMER',
  RETAILER = 'RETAILER',
  ADMIN = 'ADMIN',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
}

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ type: String, required: true, index: true })
  recipientId: string;

  @Prop({
    type: String,
    enum: RecipientType,
    required: true,
  })
  recipientType: RecipientType;

  @Prop({
    type: String,
    enum: NotificationChannel,
    required: true,
  })
  channel: NotificationChannel;

  @Prop({ type: String, required: true, index: true })
  eventType: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop({
    type: String,
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
    index: true,
  })
  status: NotificationStatus;

  @Prop({ type: Number, default: 0 })
  attempts: number;

  @Prop({ type: Date, default: null })
  lastAttemptAt: Date | null;

  @Prop({ type: String, default: null })
  failureReason: string | null;

  @Prop({ type: Date, default: null })
  sentAt: Date | null;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ recipientId: 1, eventType: 1 });
NotificationSchema.index({ status: 1, createdAt: -1 });
