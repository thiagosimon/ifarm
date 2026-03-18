import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  RetailerProduct,
  RetailerProductSchema,
} from './schemas/retailer-product.schema';
import { ProductService } from './product.service';
import { RetailerProductService } from './retailer-product.service';
import { ProductController } from './product.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: RetailerProduct.name, schema: RetailerProductSchema },
    ]),
    RabbitmqModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, RetailerProductService],
  exports: [ProductService, RetailerProductService],
})
export class ProductModule {}
