import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import {
  ReviewEligibility,
  ReviewEligibilitySchema,
} from './schemas/review-eligibility.schema';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewEventsConsumer } from './consumers/review-events.consumer';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: ReviewEligibility.name, schema: ReviewEligibilitySchema },
    ]),
    RabbitmqModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewEventsConsumer],
  exports: [ReviewService],
})
export class ReviewModule {}
