import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Quote, QuoteDocument, QuoteStatus } from './schemas/quote.schema';
import {
  Proposal,
  ProposalDocument,
  ProposalStatus,
} from './schemas/proposal.schema';
import {
  RecurringConfig,
  RecurringConfigDocument,
} from './schemas/recurring-config.schema';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);
  private readonly taxServiceUrl: string;

  constructor(
    @InjectModel(Quote.name)
    private readonly quoteModel: Model<QuoteDocument>,
    @InjectModel(Proposal.name)
    private readonly proposalModel: Model<ProposalDocument>,
    @InjectModel(RecurringConfig.name)
    private readonly recurringConfigModel: Model<RecurringConfigDocument>,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    this.taxServiceUrl =
      process.env.TAX_SERVICE_URL || 'http://localhost:3009';
  }

  /**
   * Create a proposal for a quote.
   * RCQ-003: Quote must be in OPEN or IN_PROPOSALS status.
   * Unique constraint: one proposal per retailer per quote (409 if duplicate).
   */
  async createProposal(
    quoteId: string,
    dto: CreateProposalDto,
  ): Promise<ProposalDocument> {
    // Fetch the quote
    const quote = await this.quoteModel.findById(quoteId).exec();
    if (!quote) {
      throw new NotFoundException(`Quote ${quoteId} not found`);
    }

    // RCQ-003: Only allow proposals on OPEN or IN_PROPOSALS quotes
    if (
      quote.status !== QuoteStatus.OPEN &&
      quote.status !== QuoteStatus.IN_PROPOSALS
    ) {
      throw new BadRequestException(
        `RCQ-003: Cannot submit proposal for quote with status ${quote.status}. Quote must be OPEN or IN_PROPOSALS.`,
      );
    }

    // Check for duplicate proposal from same retailer
    const existingProposal = await this.proposalModel
      .findOne({
        quoteId: new Types.ObjectId(quoteId),
        retailerId: new Types.ObjectId(dto.retailerId),
      })
      .exec();

    if (existingProposal) {
      throw new ConflictException(
        `Retailer ${dto.retailerId} has already submitted a proposal for quote ${quoteId}`,
      );
    }

    // Calculate subtotal from items
    const subtotalAmount = dto.subtotalAmount;

    // Call tax-service for tax calculation (timeout 3s, fallback without taxInfo)
    let taxInfo: Record<string, any> | null = null;
    try {
      const taxResponse = await axios.post(
        `${this.taxServiceUrl}/v1/tax/calculate`,
        {
          quoteId,
          retailerId: dto.retailerId,
          retailerStateProvince: dto.retailerSnapshot.stateProvince,
          farmerStateProvince: quote.farmerSnapshot.stateProvince,
          items: quote.items.map((qItem, idx) => ({
            productId: qItem.productId.toString(),
            tariffCode: qItem.productSnapshot.tariffCode,
            quantity: qItem.quantity,
            unitPrice: dto.items[idx]?.unitPrice || 0,
            totalPrice: dto.items[idx]?.totalPrice || 0,
          })),
          subtotalAmount,
        },
        { timeout: 3000 },
      );
      taxInfo = taxResponse.data;
      this.logger.debug(`Tax calculated for quote ${quoteId}`);
    } catch (err: any) {
      this.logger.warn(
        `Tax service unavailable or timed out for quote ${quoteId}: ${err.message}. Saving proposal without taxInfo.`,
      );
      // Fallback: proceed without taxInfo
    }

    // Calculate totalWithTaxAndDelivery
    let totalWithTaxAndDelivery: number;
    if (taxInfo && taxInfo.totalWithTax != null) {
      totalWithTaxAndDelivery = taxInfo.totalWithTax + dto.deliveryFee;
    } else {
      totalWithTaxAndDelivery = subtotalAmount + dto.deliveryFee;
    }

    // Create the proposal
    const proposal = new this.proposalModel({
      quoteId: new Types.ObjectId(quoteId),
      retailerId: new Types.ObjectId(dto.retailerId),
      retailerSnapshot: dto.retailerSnapshot,
      items: dto.items.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotalAmount,
      deliveryFee: dto.deliveryFee,
      deliveryDays: dto.deliveryDays,
      taxInfo: taxInfo
        ? {
            stateSalesTaxType: taxInfo.stateSalesTaxType,
            stateSalesTaxRate: taxInfo.stateSalesTaxRate,
            stateSalesTaxAmount: taxInfo.stateSalesTaxAmount,
            interstateVatDifferential: taxInfo.interstateVatDifferential || 0,
            taxSubstitutionAmount: taxInfo.taxSubstitutionAmount || 0,
            legalBasis: taxInfo.legalBasis || '',
            totalWithTax: taxInfo.totalWithTax,
          }
        : null,
      totalWithTaxAndDelivery,
      paymentMethods: dto.paymentMethods,
      observations: dto.observations || '',
      status: ProposalStatus.PENDING,
    });

    const saved = await proposal.save();

    // Atomic update on quote: increment proposalCount, transition to IN_PROPOSALS,
    // and update bestProposal if this one is cheaper
    const updateFields: Record<string, any> = {
      $inc: { proposalCount: 1 },
    };

    // Transition to IN_PROPOSALS on first proposal
    if (quote.status === QuoteStatus.OPEN) {
      updateFields.$set = { status: QuoteStatus.IN_PROPOSALS };
    }

    await this.quoteModel.findByIdAndUpdate(quoteId, updateFields).exec();

    // Update bestProposal if this proposal is cheaper
    await this.quoteModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(quoteId),
          $or: [
            { bestProposal: null },
            {
              'bestProposal.totalWithTaxAndDelivery': {
                $gt: totalWithTaxAndDelivery,
              },
            },
          ],
        },
        {
          $set: {
            bestProposal: {
              proposalId: saved._id,
              retailerName:
                dto.retailerSnapshot.tradeName ||
                dto.retailerSnapshot.businessName,
              totalWithTaxAndDelivery,
            },
          },
        },
      )
      .exec();

    // Publish event
    try {
      await this.rabbitmqService.publish('quotation.proposal.received', {
        proposalId: saved._id.toString(),
        quoteId,
        retailerId: dto.retailerId,
        totalWithTaxAndDelivery,
        hasTaxInfo: taxInfo !== null,
      });
    } catch (err: any) {
      this.logger.error(
        `Failed to publish quotation.proposal.received: ${err.message}`,
      );
    }

    // RCQ-004: Check for auto-accept on recurring configs
    await this.processAutoAccept(quoteId, saved);

    this.logger.log(
      `Proposal created: ${saved._id} for quote ${quoteId} by retailer ${dto.retailerId}`,
    );
    return saved;
  }

  /**
   * Accept a specific proposal for a quote.
   * RCQ-002: Atomic findOneAndUpdate with precondition to prevent race conditions.
   */
  async acceptProposal(
    quoteId: string,
    proposalId: string,
  ): Promise<{ quote: QuoteDocument; proposal: ProposalDocument }> {
    // Verify proposal exists and belongs to this quote
    const proposal = await this.proposalModel
      .findOne({
        _id: new Types.ObjectId(proposalId),
        quoteId: new Types.ObjectId(quoteId),
      })
      .exec();

    if (!proposal) {
      throw new NotFoundException(
        `Proposal ${proposalId} not found for quote ${quoteId}`,
      );
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new ConflictException(
        `Proposal ${proposalId} is already ${proposal.status}`,
      );
    }

    // RCQ-002: Atomic accept - only succeeds if status is OPEN or IN_PROPOSALS
    // and selectedProposalId is null
    const updatedQuote = await this.quoteModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(quoteId),
          status: { $in: [QuoteStatus.OPEN, QuoteStatus.IN_PROPOSALS] },
          selectedProposalId: null,
        },
        {
          $set: {
            status: QuoteStatus.ACCEPTED,
            selectedProposalId: new Types.ObjectId(proposalId),
            bestProposal: {
              proposalId: new Types.ObjectId(proposalId),
              retailerName:
                proposal.retailerSnapshot.tradeName ||
                proposal.retailerSnapshot.businessName,
              totalWithTaxAndDelivery: proposal.totalWithTaxAndDelivery,
            },
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedQuote) {
      throw new ConflictException(
        `RCQ-002: Quote ${quoteId} cannot be accepted. It may have already been accepted, expired, or cancelled.`,
      );
    }

    // Update the accepted proposal status
    await this.proposalModel
      .findByIdAndUpdate(proposalId, {
        $set: { status: ProposalStatus.ACCEPTED },
      })
      .exec();

    // Reject all other pending proposals for this quote
    await this.proposalModel
      .updateMany(
        {
          quoteId: new Types.ObjectId(quoteId),
          _id: { $ne: new Types.ObjectId(proposalId) },
          status: ProposalStatus.PENDING,
        },
        { $set: { status: ProposalStatus.REJECTED } },
      )
      .exec();

    // Publish event
    try {
      await this.rabbitmqService.publish('quotation.proposal.accepted', {
        quoteId,
        proposalId,
        farmerId: updatedQuote.farmerId.toString(),
        retailerId: proposal.retailerId.toString(),
        totalWithTaxAndDelivery: proposal.totalWithTaxAndDelivery,
        items: proposal.items.map((i) => ({
          productId: i.productId.toString(),
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
      });
    } catch (err: any) {
      this.logger.error(
        `Failed to publish quotation.proposal.accepted: ${err.message}`,
      );
    }

    this.logger.log(
      `Proposal ${proposalId} accepted for quote ${quoteId}`,
    );

    const updatedProposal = await this.proposalModel
      .findById(proposalId)
      .lean()
      .exec();

    return {
      quote: updatedQuote as unknown as QuoteDocument,
      proposal: updatedProposal as unknown as ProposalDocument,
    };
  }

  /**
   * RCQ-004: Auto-accept if recurring config has autoAccept=true
   * and totalWithTaxAndDelivery <= maxAcceptPrice.
   */
  async processAutoAccept(
    quoteId: string,
    proposal: ProposalDocument,
  ): Promise<void> {
    try {
      const quote = await this.quoteModel.findById(quoteId).exec();
      if (!quote || !quote.parentQuoteId) {
        // Not a recurring-generated quote; skip
        return;
      }

      // Find the recurring config that generated this quote
      // by checking if there is a config with autoAccept for this farmer
      const recurringConfig = await this.recurringConfigModel
        .findOne({
          farmerId: quote.farmerId,
          status: 'ACTIVE',
          autoAccept: true,
        })
        .exec();

      if (!recurringConfig) {
        return;
      }

      // Check price threshold
      if (
        recurringConfig.maxAcceptPrice != null &&
        proposal.totalWithTaxAndDelivery > recurringConfig.maxAcceptPrice
      ) {
        this.logger.debug(
          `Auto-accept skipped: proposal total ${proposal.totalWithTaxAndDelivery} exceeds max ${recurringConfig.maxAcceptPrice}`,
        );
        return;
      }

      // Auto-accept this proposal
      const proposalDoc = proposal as any;
      const proposalId = proposalDoc._id?.toString() || proposalDoc.id;

      const updatedQuote = await this.quoteModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(quoteId),
            status: { $in: [QuoteStatus.OPEN, QuoteStatus.IN_PROPOSALS] },
            selectedProposalId: null,
          },
          {
            $set: {
              status: QuoteStatus.ACCEPTED,
              selectedProposalId: new Types.ObjectId(proposalId),
              bestProposal: {
                proposalId: new Types.ObjectId(proposalId),
                retailerName:
                  proposal.retailerSnapshot.tradeName ||
                  proposal.retailerSnapshot.businessName,
                totalWithTaxAndDelivery: proposal.totalWithTaxAndDelivery,
              },
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedQuote) {
        this.logger.debug(
          `Auto-accept: quote ${quoteId} already accepted or not eligible`,
        );
        return;
      }

      // Update proposal status
      await this.proposalModel
        .findByIdAndUpdate(proposalId, {
          $set: { status: ProposalStatus.ACCEPTED },
        })
        .exec();

      // Reject other pending proposals
      await this.proposalModel
        .updateMany(
          {
            quoteId: new Types.ObjectId(quoteId),
            _id: { $ne: new Types.ObjectId(proposalId) },
            status: ProposalStatus.PENDING,
          },
          { $set: { status: ProposalStatus.REJECTED } },
        )
        .exec();

      // Publish auto-accept event
      try {
        await this.rabbitmqService.publish('quotation.auto.accepted', {
          quoteId,
          proposalId,
          farmerId: updatedQuote.farmerId.toString(),
          retailerId: proposal.retailerId.toString(),
          totalWithTaxAndDelivery: proposal.totalWithTaxAndDelivery,
          recurringConfigId: recurringConfig._id.toString(),
        });
      } catch (err: any) {
        this.logger.error(
          `Failed to publish quotation.auto.accepted: ${err.message}`,
        );
      }

      this.logger.log(
        `RCQ-004: Auto-accepted proposal ${proposalId} for recurring quote ${quoteId}`,
      );
    } catch (err: any) {
      this.logger.error(
        `Error in processAutoAccept for quote ${quoteId}: ${err.message}`,
      );
    }
  }
}
