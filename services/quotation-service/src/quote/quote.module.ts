import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { Proposal, ProposalSchema } from './schemas/proposal.schema';
import {
  RecurringConfig,
  RecurringConfigSchema,
} from './schemas/recurring-config.schema';
import { QuoteService } from './quote.service';
import { ProposalService } from './proposal.service';
import { RecurringService } from './recurring.service';
import { QuoteController } from './quote.controller';
import { ExpirationProcessor } from '../jobs/expiration.processor';
import { RecurringProcessor } from '../jobs/recurring.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quote.name, schema: QuoteSchema },
      { name: Proposal.name, schema: ProposalSchema },
      { name: RecurringConfig.name, schema: RecurringConfigSchema },
    ]),
    BullModule.registerQueue(
      { name: 'quote-expiration' },
      { name: 'quote-recurring' },
    ),
  ],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    ProposalService,
    RecurringService,
    ExpirationProcessor,
    RecurringProcessor,
  ],
  exports: [QuoteService, ProposalService, RecurringService],
})
export class QuoteModule {}
