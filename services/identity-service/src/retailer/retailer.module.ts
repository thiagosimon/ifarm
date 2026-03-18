import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Retailer, RetailerSchema } from './schemas/retailer.schema';
import { RetailerService } from './retailer.service';
import { RetailerController } from './retailer.controller';
import { SerproModule } from '../serpro/serpro.module';
import { StorageModule } from '../storage/storage.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Retailer.name, schema: RetailerSchema },
    ]),
    SerproModule,
    StorageModule,
    RabbitmqModule,
  ],
  controllers: [RetailerController],
  providers: [RetailerService],
  exports: [RetailerService],
})
export class RetailerModule {}
