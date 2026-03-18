import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job } from 'bullmq';
import { Quote, QuoteDocument, QuoteStatus } from '../quote/schemas/quote.schema';
import {
  Proposal,
  ProposalDocument,
  ProposalStatus,
} from '../quote/schemas/proposal.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

/**
 * RCQ-005: Expiration processor.
 * Runs every 15 minutes via BullMQ repeatable job.
 * Finds quotes that are OPEN or IN_PROPOSALS and whose expiresAt <= now,
 * sets their status to EXPIRED, expires their pending proposals,
 * and publishes quotation.quote.expired events.
 */
@Processor('quote-expiration')
export class ExpirationProcessor extends WorkerHost {
  private readonly logger = new Logger(ExpirationProcessor.name);
  private initialized = false;

  constructor(
    @InjectModel(Quote.name)
    private readonly quoteModel: Model<QuoteDocument>,
    @InjectModel(Proposal.name)
    private readonly proposalModel: Model<ProposalDocument>,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    super();
  }

  async onModuleInit(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    // Register repeatable job: every 15 minutes
    try {
      const queue = (this as any).worker?.queue;
      if (queue) {
        await queue.add(
          'expire-quotes',
          {},
          {
            repeat: {
              pattern: '*/15 * * * *',
            },
            removeOnComplete: 100,
            removeOnFail: 200,
          },
        );
        this.logger.log('Expiration repeatable job registered (every 15 min)');
      }
    } catch (err: any) {
      this.logger.warn(
        `Could not register repeatable job (will be registered externally): ${err.message}`,
      );
    }
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Running quote expiration check (job ${job.id})`);

    const now = new Date();
    let expiredCount = 0;

    // Find all quotes that should be expired
    const expiredQuotes = await this.quoteModel
      .find({
        status: { $in: [QuoteStatus.OPEN, QuoteStatus.IN_PROPOSALS] },
        expiresAt: { $lte: now },
      })
      .exec();

    for (const quote of expiredQuotes) {
      try {
        // Atomically set status to EXPIRED
        const updated = await this.quoteModel
          .findOneAndUpdate(
            {
              _id: quote._id,
              status: { $in: [QuoteStatus.OPEN, QuoteStatus.IN_PROPOSALS] },
            },
            { $set: { status: QuoteStatus.EXPIRED } },
            { new: true },
          )
          .exec();

        if (!updated) continue;

        // Expire all pending proposals for this quote
        await this.proposalModel
          .updateMany(
            {
              quoteId: quote._id,
              status: ProposalStatus.PENDING,
            },
            { $set: { status: ProposalStatus.EXPIRED } },
          )
          .exec();

        // Publish event
        try {
          await this.rabbitmqService.publish('quotation.quote.expired', {
            quoteId: quote._id.toString(),
            quoteNumber: quote.quoteNumber,
            farmerId: quote.farmerId.toString(),
            proposalCount: quote.proposalCount,
            expiresAt: quote.expiresAt.toISOString(),
            expiredAt: now.toISOString(),
          });
        } catch (pubErr: any) {
          this.logger.error(
            `Failed to publish quotation.quote.expired for ${quote._id}: ${pubErr.message}`,
          );
        }

        expiredCount++;
      } catch (err: any) {
        this.logger.error(
          `Error expiring quote ${quote._id}: ${err.message}`,
        );
      }
    }

    this.logger.log(
      `Expiration check complete: ${expiredCount} quotes expired out of ${expiredQuotes.length} candidates`,
    );
  }
}
