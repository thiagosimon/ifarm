import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from './notification/notification.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://ifarm:ifarm123@localhost:27017/ifarm_notification',
    ),
    BullModule.forRoot({
      connection: (() => {
        const url = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
        return {
          host: url.hostname,
          port: parseInt(url.port || '6379', 10),
          ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
        };
      })(),
    }),
    RabbitmqModule,
    NotificationModule,
    HealthModule,
  ],
})
export class AppModule {}
