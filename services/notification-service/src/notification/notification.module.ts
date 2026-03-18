import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import {
  NotificationPreference,
  NotificationPreferenceSchema,
} from './schemas/notification-preference.schema';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationEventsConsumer } from './consumers/notification-events.consumer';
import { NotificationSendProcessor } from './consumers/notification-send.processor';
import { OneSignalAdapter } from './adapters/onesignal.adapter';
import { WhatsAppAdapter } from './adapters/whatsapp.adapter';
import { SesAdapter } from './adapters/ses.adapter';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationPreference.name, schema: NotificationPreferenceSchema },
    ]),
    BullModule.registerQueue({
      name: 'notification-send',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'custom',
        },
        removeOnComplete: 100,
        removeOnFail: false,
      },
    }),
    RabbitmqModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationEventsConsumer,
    NotificationSendProcessor,
    OneSignalAdapter,
    WhatsAppAdapter,
    SesAdapter,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
