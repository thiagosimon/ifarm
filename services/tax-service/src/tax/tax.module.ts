import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxRule, TaxRuleSchema } from './schemas/tax-rule.schema';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaxRule.name, schema: TaxRuleSchema },
    ]),
  ],
  controllers: [TaxController],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
