import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmerModule } from './farmer/farmer.module';
import { RetailerModule } from './retailer/retailer.module';
import { KycModule } from './kyc/kyc.module';
import { CryptoModule } from './crypto/crypto.module';
import { SerproModule } from './serpro/serpro.module';
import { StorageModule } from './storage/storage.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ifarm_identity',
    ),
    CryptoModule,
    RabbitmqModule,
    StorageModule,
    SerproModule,
    FarmerModule,
    RetailerModule,
    KycModule,
    HealthModule,
  ],
})
export class AppModule {}
