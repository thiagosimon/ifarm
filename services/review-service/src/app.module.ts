import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from './review/review.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://ifarm:ifarm123@localhost:27017/ifarm_review',
    ),
    RabbitmqModule,
    ReviewModule,
    HealthModule,
  ],
})
export class AppModule {}
