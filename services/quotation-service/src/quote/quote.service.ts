import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Quote, QuoteDocument, QuoteStatus } from './schemas/quote.schema';
import {
  Proposal,
  ProposalDocument,
} from './schemas/proposal.schema';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);

  constructor(
    @InjectModel(Quote.name)
    private readonly quoteModel: Model<QuoteDocument>,
    @InjectModel(Proposal.name)
    private readonly proposalModel: Model<ProposalDocument>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  /**
   * Create a new quote.
   * RCQ-001: tariffCode is mandatory on every item.
   */
  async createQuote(dto: CreateQuoteDto): Promise<QuoteDocument> {
    // RCQ-001 - enforce tariffCode on every item (belt-and-suspenders; DTO also validates)
    for (const item of dto.items) {
      if (
        !item.productSnapshot?.tariffCode ||
        !/^\d{8}$/.test(item.productSnapshot.tariffCode)
      ) {
        throw new BadRequestException(
          `RCQ-001: tariffCode (NCM) is required and must be 8 digits for product ${item.productId}`,
        );
      }
    }

    const expirationHours =
      dto.expirationHours ||
      parseInt(process.env.QUOTE_EXPIRATION_HOURS || '24', 10);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    const quoteNumber = this.generateQuoteNumber();

    const quote = new this.quoteModel({
      quoteNumber,
      farmerId: new Types.ObjectId(dto.farmerId),
      farmerSnapshot: dto.farmerSnapshot,
      items: dto.items.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        productSnapshot: item.productSnapshot,
        quantity: item.quantity,
        measurementUnit: item.measurementUnit,
      })),
      deliveryMode: dto.deliveryMode,
      deliveryAddress: dto.deliveryAddress || null,
      preferredPaymentMethod: dto.preferredPaymentMethod,
      status: QuoteStatus.OPEN,
      proposalCount: 0,
      bestProposal: null,
      selectedProposalId: null,
      parentQuoteId: null,
      expiresAt,
    });

    const saved = await quote.save();

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
      });
    } catch (err: any) {
      this.logger.error(
        `Failed to publish quotation.quote.created: ${err.message}`,
      );
      // Non-blocking: the quote was already persisted
    }

    this.logger.log(`Quote created: ${saved.quoteNumber} (${saved._id})`);
    return saved;
  }

  /**
   * Get paginated quotes for a farmer.
   */
  async getQuotes(
    farmerId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: QuoteDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const filter = { farmerId: new Types.ObjectId(farmerId) };

    const [data, total] = await Promise.all([
      this.quoteModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.quoteModel.countDocuments(filter).exec(),
    ]);

    return {
      data: data as unknown as QuoteDocument[],
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  /**
   * Get a single quote by ID, enriched with its proposals.
   */
  async getQuoteById(quoteId: string): Promise<{
    quote: QuoteDocument;
    proposals: ProposalDocument[];
  }> {
    const quote = await this.quoteModel
      .findById(quoteId)
      .lean()
      .exec();

    if (!quote) {
      throw new NotFoundException(`Quote ${quoteId} not found`);
    }

    const proposals = await this.proposalModel
      .find({ quoteId: new Types.ObjectId(quoteId) })
      .sort({ totalWithTaxAndDelivery: 1 })
      .lean()
      .exec();

    return {
      quote: quote as unknown as QuoteDocument,
      proposals: proposals as unknown as ProposalDocument[],
    };
  }

  /**
   * GET /v1/quotes/:id/compare
   * Returns a comparison table of proposals for the quote,
   * sorted by totalWithTaxAndDelivery ascending.
   */
  async getCompareTable(quoteId: string): Promise<{
    quote: Record<string, any>;
    proposals: Record<string, any>[];
  }> {
    const objectId = new Types.ObjectId(quoteId);

    const result = await this.quoteModel
      .aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: 'proposals',
            localField: '_id',
            foreignField: 'quoteId',
            as: 'proposals',
          },
        },
        {
          $addFields: {
            proposals: {
              $sortArray: {
                input: '$proposals',
                sortBy: { totalWithTaxAndDelivery: 1 },
              },
            },
          },
        },
        {
          $project: {
            quoteNumber: 1,
            farmerId: 1,
            farmerSnapshot: 1,
            items: 1,
            deliveryMode: 1,
            deliveryAddress: 1,
            preferredPaymentMethod: 1,
            status: 1,
            proposalCount: 1,
            bestProposal: 1,
            expiresAt: 1,
            createdAt: 1,
            proposals: {
              _id: 1,
              retailerId: 1,
              retailerSnapshot: 1,
              items: 1,
              subtotalAmount: 1,
              deliveryFee: 1,
              deliveryDays: 1,
              taxInfo: 1,
              totalWithTaxAndDelivery: 1,
              paymentMethods: 1,
              observations: 1,
              status: 1,
              createdAt: 1,
            },
          },
        },
      ])
      .exec();

    if (!result || result.length === 0) {
      throw new NotFoundException(`Quote ${quoteId} not found`);
    }

    const doc = result[0];
    return {
      quote: {
        _id: doc._id,
        quoteNumber: doc.quoteNumber,
        farmerId: doc.farmerId,
        farmerSnapshot: doc.farmerSnapshot,
        items: doc.items,
        deliveryMode: doc.deliveryMode,
        deliveryAddress: doc.deliveryAddress,
        preferredPaymentMethod: doc.preferredPaymentMethod,
        status: doc.status,
        proposalCount: doc.proposalCount,
        bestProposal: doc.bestProposal,
        expiresAt: doc.expiresAt,
        createdAt: doc.createdAt,
      },
      proposals: doc.proposals,
    };
  }

  /**
   * Generate a human-readable quote number: QT-YYYYMMDD-XXXX
   */
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
