import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { ProposalService } from './proposal.service';
import { RecurringService } from './recurring.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import {
  CreateRecurringDto,
  UpdateRecurringDto,
} from './dto/create-recurring.dto';

@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly proposalService: ProposalService,
    private readonly recurringService: RecurringService,
  ) {}

  // ─── Quote Endpoints ────────────────────────────────────────────

  /**
   * POST /v1/quotes
   * Create a new quotation request (FARMER).
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuote(@Body() dto: CreateQuoteDto) {
    const quote = await this.quoteService.createQuote(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Quote created successfully',
      data: quote,
    };
  }

  /**
   * GET /v1/quotes
   * List quotes for a farmer (paginated).
   */
  @Get()
  async getQuotes(
    @Query('farmerId') farmerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const result = await this.quoteService.getQuotes(farmerId, page, limit);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  /**
   * GET /v1/quotes/recurring
   * List recurring configs for a farmer.
   * NOTE: This must come BEFORE /:id routes to avoid "recurring" being treated as an id.
   */
  @Get('recurring')
  async getRecurringConfigs(
    @Query('farmerId') farmerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const result = await this.recurringService.findByFarmer(
      farmerId,
      page,
      limit,
    );
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  /**
   * POST /v1/quotes/recurring
   * Create a recurring quote configuration (FARMER).
   */
  @Post('recurring')
  @HttpCode(HttpStatus.CREATED)
  async createRecurring(@Body() dto: CreateRecurringDto) {
    const config = await this.recurringService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Recurring configuration created successfully',
      data: config,
    };
  }

  /**
   * PATCH /v1/quotes/recurring/:id
   * Update a recurring config (FARMER).
   */
  @Patch('recurring/:id')
  async updateRecurring(
    @Param('id') id: string,
    @Query('farmerId') farmerId: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    const config = await this.recurringService.update(id, farmerId, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recurring configuration updated successfully',
      data: config,
    };
  }

  /**
   * GET /v1/quotes/:id
   * Get a single quote with its proposals.
   */
  @Get(':id')
  async getQuoteById(@Param('id') id: string) {
    const result = await this.quoteService.getQuoteById(id);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  /**
   * GET /v1/quotes/:id/compare
   * Get comparison table for a quote's proposals.
   */
  @Get(':id/compare')
  async getCompareTable(@Param('id') id: string) {
    const result = await this.quoteService.getCompareTable(id);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  // ─── Proposal Endpoints ─────────────────────────────────────────

  /**
   * POST /v1/quotes/:id/proposals
   * Submit a proposal for a quote (RETAILER).
   */
  @Post(':id/proposals')
  @HttpCode(HttpStatus.CREATED)
  async createProposal(
    @Param('id') quoteId: string,
    @Body() dto: CreateProposalDto,
  ) {
    const proposal = await this.proposalService.createProposal(quoteId, dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Proposal submitted successfully',
      data: proposal,
    };
  }

  /**
   * POST /v1/quotes/:id/proposals/:pid/accept
   * Accept a proposal for a quote (FARMER).
   */
  @Post(':id/proposals/:pid/accept')
  @HttpCode(HttpStatus.OK)
  async acceptProposal(
    @Param('id') quoteId: string,
    @Param('pid') proposalId: string,
  ) {
    const result = await this.proposalService.acceptProposal(
      quoteId,
      proposalId,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Proposal accepted successfully',
      data: result,
    };
  }
}
