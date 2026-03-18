import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('v1/reviews')
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }

    const review = await this.reviewService.createReview(userId, dto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Review created successfully',
      data: {
        id: review._id,
        orderId: review.orderId,
        overallRating: review.overallRating,
        isModerationFlagged: review.isModerationFlagged,
        isPublished: review.isPublished,
      },
    };
  }

  @Get('v1/retailers/:id/reviews')
  async getRetailerReviews(
    @Param('id') retailerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

    const result = await this.reviewService.getRetailerReviews(
      retailerId,
      pageNum,
      limitNum,
    );

    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('v1/admin/reviews/flagged')
  async getFlaggedReviews(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

    const result = await this.reviewService.getFlaggedReviews(pageNum, limitNum);

    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Patch('v1/admin/reviews/:id/moderate')
  @HttpCode(HttpStatus.OK)
  async moderateReview(
    @Param('id') reviewId: string,
    @Body() dto: ModerateReviewDto,
  ) {
    const review = await this.reviewService.moderateReview(reviewId, dto);

    return {
      statusCode: HttpStatus.OK,
      message: dto.isApproved
        ? 'Review approved and published'
        : 'Review rejected',
      data: {
        id: review._id,
        orderId: review.orderId,
        isPublished: review.isPublished,
        isModerationFlagged: review.isModerationFlagged,
      },
    };
  }
}
