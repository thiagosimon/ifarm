import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import {
  ReviewEligibility,
  ReviewEligibilityDocument,
} from './schemas/review-eligibility.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { containsBlocklistedWord } from './helpers/blocklist';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(ReviewEligibility.name)
    private readonly eligibilityModel: Model<ReviewEligibilityDocument>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async createReview(
    farmerId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewDocument> {
    const eligibility = await this.eligibilityModel
      .findOne({ orderId: dto.orderId })
      .exec();

    if (!eligibility) {
      throw new NotFoundException(
        `No eligibility record found for order ${dto.orderId}. The order may not have been delivered yet.`,
      );
    }

    if (!eligibility.isEligible) {
      throw new BadRequestException(
        'Review eligibility has been revoked for this order.',
      );
    }

    if (eligibility.farmerId !== farmerId) {
      throw new BadRequestException(
        'You are not authorized to review this order.',
      );
    }

    if (eligibility.reviewedAt) {
      throw new ConflictException(
        'A review has already been submitted for this order.',
      );
    }

    const now = new Date();
    if (eligibility.expiresAt < now) {
      throw new BadRequestException(
        'The review period for this order has expired (30 days after delivery).',
      );
    }

    const existingReview = await this.reviewModel
      .findOne({ orderId: dto.orderId })
      .exec();

    if (existingReview) {
      throw new ConflictException(
        'A review already exists for this order.',
      );
    }

    let isModerationFlagged = false;
    let isPublished = true;

    if (dto.comment && containsBlocklistedWord(dto.comment)) {
      isModerationFlagged = true;
      isPublished = false;
      this.logger.warn(
        `Review for order ${dto.orderId} flagged for moderation due to blocklisted content`,
      );
    }

    const review = new this.reviewModel({
      orderId: dto.orderId,
      farmerId,
      retailerId: eligibility.retailerId,
      overallRating: dto.overallRating,
      deliveryRating: dto.deliveryRating || null,
      productQualityRating: dto.productQualityRating || null,
      communicationRating: dto.communicationRating || null,
      comment: dto.comment || null,
      isModerationFlagged,
      isPublished,
    });

    const saved = await review.save();

    await this.eligibilityModel
      .findOneAndUpdate(
        { orderId: dto.orderId },
        { reviewedAt: new Date() },
      )
      .exec();

    await this.recalculateRetailerRating(eligibility.retailerId);

    await this.rabbitmqService.publish(
      'review.events',
      'review.created',
      {
        reviewId: saved._id.toString(),
        orderId: dto.orderId,
        farmerId,
        retailerId: eligibility.retailerId,
        overallRating: dto.overallRating,
        isModerationFlagged,
        createdAt: new Date().toISOString(),
      },
    );

    this.logger.log(
      `Review created for order ${dto.orderId} by farmer ${farmerId}`,
    );
    return saved;
  }

  async getRetailerReviews(
    retailerId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: ReviewDocument[];
    total: number;
    page: number;
    totalPages: number;
    avgRating: number | null;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.reviewModel
        .find({ retailerId, isPublished: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-isModerationFlagged')
        .exec(),
      this.reviewModel
        .countDocuments({ retailerId, isPublished: true })
        .exec(),
    ]);

    const avgResult = await this.reviewModel.aggregate([
      { $match: { retailerId, isPublished: true } },
      { $group: { _id: null, avgRating: { $avg: '$overallRating' } } },
    ]);

    const avgRating =
      avgResult.length > 0
        ? Math.round(avgResult[0].avgRating * 10) / 10
        : null;

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      avgRating,
    };
  }

  async getFlaggedReviews(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: ReviewDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.reviewModel
        .find({ isModerationFlagged: true, isPublished: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewModel
        .countDocuments({ isModerationFlagged: true, isPublished: false })
        .exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async moderateReview(
    reviewId: string,
    dto: ModerateReviewDto,
  ): Promise<ReviewDocument> {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new BadRequestException('Invalid review ID format');
    }

    const review = await this.reviewModel.findById(reviewId).exec();

    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    if (!review.isModerationFlagged) {
      throw new BadRequestException('This review is not flagged for moderation');
    }

    if (dto.isApproved) {
      review.isPublished = true;
    } else {
      review.isPublished = false;
    }

    review.isModerationFlagged = false;
    const updated = await review.save();

    if (dto.isApproved) {
      await this.recalculateRetailerRating(review.retailerId);
    }

    await this.rabbitmqService.publish(
      'review.events',
      'review.moderated',
      {
        reviewId: updated._id.toString(),
        orderId: updated.orderId,
        retailerId: updated.retailerId,
        isApproved: dto.isApproved,
        moderatedAt: new Date().toISOString(),
      },
    );

    this.logger.log(
      `Review ${reviewId} moderated: ${dto.isApproved ? 'approved' : 'rejected'}`,
    );
    return updated;
  }

  async createEligibility(
    orderId: string,
    farmerId: string,
    retailerId: string,
  ): Promise<ReviewEligibilityDocument> {
    const existing = await this.eligibilityModel
      .findOne({ orderId })
      .exec();

    if (existing) {
      this.logger.warn(
        `Eligibility already exists for order ${orderId}, skipping`,
      );
      return existing;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const eligibility = new this.eligibilityModel({
      orderId,
      farmerId,
      retailerId,
      isEligible: true,
      expiresAt,
      reviewedAt: null,
    });

    const saved = await eligibility.save();
    this.logger.log(
      `Review eligibility created for order ${orderId}, expires ${expiresAt.toISOString()}`,
    );
    return saved;
  }

  async expireEligibility(orderId: string): Promise<void> {
    const eligibility = await this.eligibilityModel
      .findOne({ orderId, reviewedAt: null })
      .exec();

    if (!eligibility) {
      return;
    }

    eligibility.isEligible = false;
    await eligibility.save();

    this.logger.log(`Review eligibility expired for order ${orderId}`);
  }

  private async recalculateRetailerRating(retailerId: string): Promise<void> {
    const avgResult = await this.reviewModel.aggregate([
      { $match: { retailerId, isPublished: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (avgResult.length > 0) {
      const avgRating = Math.round(avgResult[0].avgRating * 10) / 10;
      const totalReviews = avgResult[0].totalReviews;

      await this.rabbitmqService.publish(
        'review.events',
        'review.rating.recalculated',
        {
          retailerId,
          avgRating,
          totalReviews,
          recalculatedAt: new Date().toISOString(),
        },
      );

      this.logger.log(
        `Retailer ${retailerId} rating recalculated: ${avgRating} (${totalReviews} reviews)`,
      );
    }
  }
}
