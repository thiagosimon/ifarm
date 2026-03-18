import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TaxModule } from './tax/tax.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://ifarm:ifarm123@localhost:27017/ifarm_tax',
    ),
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
    }),
    TaxModule,
    HealthModule,
  ],
})
export class AppModule {}
