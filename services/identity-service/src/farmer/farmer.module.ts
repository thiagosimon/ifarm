import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Farmer, FarmerSchema } from './schemas/farmer.schema';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { SerproModule } from '../serpro/serpro.module';
import { StorageModule } from '../storage/storage.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farmer.name, schema: FarmerSchema }]),
    SerproModule,
    StorageModule,
    RabbitmqModule,
  ],
  controllers: [FarmerController],
  providers: [FarmerService],
  exports: [FarmerService],
})
export class FarmerModule {}
