import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchingModule } from './matching/matching.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://ifarm:ifarm123@localhost:27017/ifarm_matching',
    ),
    RabbitmqModule,
    MatchingModule,
    HealthModule,
  ],
})
export class AppModule {}
