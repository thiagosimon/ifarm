import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PagarmeAdapter } from './pagarme.adapter';
import { PaymentEventsConsumer } from './consumers/payment-events.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [PaymentController],
  providers: [PaymentService, PagarmeAdapter, PaymentEventsConsumer],
  exports: [PaymentService],
})
export class PaymentModule {}
