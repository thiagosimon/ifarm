import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationPreferenceDocument = NotificationPreference & Document;

@Schema({ timestamps: true, collection: 'notification_preferences' })
export class NotificationPreference {
  @Prop({ type: String, required: true, unique: true, index: true })
  externalAuthId: string;

  @Prop({ type: Boolean, default: true })
  isPushEnabled: boolean;

  @Prop({ type: Boolean, default: true })
  isWhatsappEnabled: boolean;

  @Prop({ type: Boolean, default: true })
  isEmailEnabled: boolean;

  @Prop(
    raw({
      start: { type: String, default: '22:00' },
      end: { type: String, default: '07:00' },
    }),
  )
  quietHours: { start: string; end: string };

  @Prop({ type: String, default: 'America/Sao_Paulo' })
  timezone: string;
}

export const NotificationPreferenceSchema =
  SchemaFactory.createForClass(NotificationPreference);
