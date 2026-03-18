import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://ifarm:ifarm123@localhost:27017/ifarm_catalog',
    ),
    RabbitmqModule,
    ProductModule,
    CategoryModule,
    HealthModule,
  ],
})
export class AppModule {}
