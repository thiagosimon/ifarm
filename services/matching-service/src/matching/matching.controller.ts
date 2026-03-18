import {
  Controller,
  Get,
  Param,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MatchingService } from './matching.service';

@Controller('v1/matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get('quote/:quoteId')
  async getMatchingForQuote(@Param('quoteId') quoteId: string) {
    if (!Types.ObjectId.isValid(quoteId)) {
      throw new BadRequestException('Invalid quoteId format');
    }

    const result = await this.matchingService.getMatchingResult(quoteId);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
