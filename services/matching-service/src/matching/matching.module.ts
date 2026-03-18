import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { MatchingEventsConsumer } from './consumers/matching-events.consumer';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [MatchingController],
  providers: [MatchingService, MatchingEventsConsumer],
  exports: [MatchingService],
})
export class MatchingModule {}
