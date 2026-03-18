import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Commission } from './entities/commission.entity';
import { CommissionService } from './commission.service';
import { CommissionController, RetailerCommissionController } from './commission.controller';
import { CommissionEventsConsumer } from './consumers/commission-events.consumer';
import { HoldbackReleaseProcessor } from './jobs/holdback-release.processor';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission]),
    BullModule.registerQueue({
      name: 'holdback-release',
    }),
    RabbitmqModule,
  ],
  controllers: [CommissionController, RetailerCommissionController],
  providers: [
    CommissionService,
    CommissionEventsConsumer,
    HoldbackReleaseProcessor,
  ],
  exports: [CommissionService],
})
export class CommissionModule {}
