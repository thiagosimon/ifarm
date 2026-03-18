import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { Quote, QuoteDocument, QuoteStatus } from '../quote/schemas/quote.schema';
import {
  RecurringConfig,
  RecurringConfigDocument,
  RecurringStatus,
} from '../quote/schemas/recurring-config.schema';
import { RecurringService } from '../quote/recurring.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

/**
 * Recurring quote processor.
 * Runs every hour via BullMQ repeatable job.
 * Finds active recurring configs where nextFireAt <= now,
 * creates new quotes from them, and advances nextFireAt.
 */
@Processor('quote-recurring')
export class RecurringProcessor extends WorkerHost {
  private readonly logger = new Logger(RecurringProcessor.name);
  private initialized = false;

  constructor(
    @InjectModel(Quote.name)
    private readonly quoteModel: Model<QuoteDocument>,
    @InjectModel(RecurringConfig.name)
    private readonly recurringConfigModel: Model<RecurringConfigDocument>,
    private readonly recurringService: RecurringService,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    super();
  }

  async onModuleInit(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const queue = (this as any).worker?.queue;
      if (queue) {
        await queue.add(
          'create-recurring-quotes',
          {},
          {
            repeat: {
              pattern: '0 * * * *',
            },
            removeOnComplete: 100,
            removeOnFail: 200,
          },
        );
        this.logger.log('Recurring repeatable job registered (every hour)');
      }
    } catch (err: any) {
      this.logger.warn(
        `Could not register repeatable job (will be registered externally): ${err.message}`,
      );
    }
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Running recurring quote creation (job ${job.id})`);

    const dueConfigs = await this.recurringService.findDueConfigs();
    let createdCount = 0;

    for (const config of dueConfigs) {
      try {
        const expirationHours = parseInt(
          process.env.QUOTE_EXPIRATION_HOURS || '24',
          10,
        );
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expirationHours);

        const quoteNumber = this.generateQuoteNumber();

        // Create a new quote from the recurring config
        const quote = new this.quoteModel({
          quoteNumber,
          farmerId: config.farmerId,
          farmerSnapshot: {
            fullName: 'Recurring',
            stateProvince: config.deliveryAddress?.stateProvince || '',
            city: config.deliveryAddress?.city || '',
          },
          items: [
            {
              productId: config.productId,
              productSnapshot: {
                name: config.productSnapshot.name,
                category: config.productSnapshot.category,
                tariffCode: config.productSnapshot.tariffCode,
                measurementUnit: config.measurementUnit,
              },
              quantity: config.quantity,
              measurementUnit: config.measurementUnit,
            },
          ],
          deliveryMode: config.deliveryMode,
          deliveryAddress: config.deliveryAddress || null,
          preferredPaymentMethod: config.preferredPaymentMethod,
          status: QuoteStatus.OPEN,
          proposalCount: 0,
          bestProposal: null,
          selectedProposalId: null,
          parentQuoteId: config._id,
          expiresAt,
        });

        const saved = await quote.save();

        // Advance the nextFireAt for this config
        await this.recurringService.advanceNextFire(
          config._id.toString(),
        );

        // Publish event
        try {
          await this.rabbitmqService.publish('quotation.quote.created', {
            quoteId: saved._id.toString(),
            quoteNumber: saved.quoteNumber,
            farmerId: saved.farmerId.toString(),
            items: saved.items.map((i) => ({
              productId: i.productId.toString(),
              tariffCode: i.productSnapshot.tariffCode,
              quantity: i.quantity,
              measurementUnit: i.measurementUnit,
            })),
            deliveryMode: saved.deliveryMode,
            deliveryAddress: saved.deliveryAddress,
            preferredPaymentMethod: saved.preferredPaymentMethod,
            expiresAt: saved.expiresAt.toISOString(),
            isRecurring: true,
            recurringConfigId: config._id.toString(),
          });
        } catch (pubErr: any) {
          this.logger.error(
            `Failed to publish quotation.quote.created for recurring: ${pubErr.message}`,
          );
        }

        createdCount++;
        this.logger.debug(
          `Recurring quote created: ${saved.quoteNumber} from config ${config._id}`,
        );
      } catch (err: any) {
        this.logger.error(
          `Error creating recurring quote from config ${config._id}: ${err.message}`,
        );
      }
    }

    this.logger.log(
      `Recurring check complete: ${createdCount} quotes created from ${dueConfigs.length} due configs`,
    );
  }

  private generateQuoteNumber(): string {
    const now = new Date();
    const datePart =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const randomPart = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `QT-${datePart}-${randomPart}`;
  }
}
