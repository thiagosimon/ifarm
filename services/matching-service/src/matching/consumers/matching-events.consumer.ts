import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from '../../rabbitmq/rabbitmq.service';
import { MatchingService, QuoteData } from '../matching.service';

@Injectable()
export class MatchingEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(MatchingEventsConsumer.name);

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly matchingService: MatchingService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitmqService.subscribe(
      'matching.quote_events',
      'quotation.quote.created',
      this.handleQuoteCreated.bind(this),
    );

    await this.rabbitmqService.subscribe(
      'matching.recurring_events',
      'quotation.recurring.triggered',
      this.handleRecurringTriggered.bind(this),
    );

    this.logger.log('Matching events consumer initialized');
  }

  private async handleQuoteCreated(payload: any): Promise<void> {
    this.logger.log(`Processing quote created: ${payload.quoteId}`);

    const quoteData: QuoteData = {
      quoteId: payload.quoteId,
      farmerId: payload.farmerId,
      farmerSnapshot: payload.farmerSnapshot,
      items: payload.items,
      preferredPaymentMethod: payload.preferredPaymentMethod,
    };

    await this.matchingService.processQuoteCreated(quoteData);
  }

  private async handleRecurringTriggered(payload: any): Promise<void> {
    this.logger.log(
      `Processing recurring quote triggered: ${payload.quoteId}`,
    );

    const quoteData: QuoteData = {
      quoteId: payload.quoteId,
      farmerId: payload.farmerId,
      farmerSnapshot: payload.farmerSnapshot,
      items: payload.items,
      preferredPaymentMethod: payload.preferredPaymentMethod,
    };

    await this.matchingService.processQuoteCreated(quoteData);
  }
}
