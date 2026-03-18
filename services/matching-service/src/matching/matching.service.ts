import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import Redis from 'ioredis';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

const MAX_RETAILERS_PER_QUOTE = 20;
const REDIS_CACHE_TTL = 300; // 5 minutes

export interface QuoteData {
  quoteId: string;
  farmerId: string;
  farmerSnapshot: {
    fullName: string;
    stateProvince: string;
    city: string;
  };
  items: Array<{
    productId: string;
    productSnapshot: {
      name: string;
      category: string;
      tariffCode: string;
      measurementUnit: string;
    };
    quantity: number;
    measurementUnit: string;
  }>;
  preferredPaymentMethod?: string;
}

export interface EligibleRetailer {
  retailerId: string;
  retailerName: string;
  matchedProducts: Array<{
    productId: string;
    unitPrice: number;
    availableStock: number;
  }>;
  avgRating: number;
  totalSales: number;
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);
  private readonly redis: Redis;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });
    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis connection failed (cache disabled): ${err.message}`);
    });
  }

  async findEligibleRetailers(quoteData: QuoteData): Promise<EligibleRetailer[]> {
    const productIds = quoteData.items.map(
      (item) => new Types.ObjectId(item.productId),
    );
    const farmerStateProvince = quoteData.farmerSnapshot.stateProvince;

    // Check cache
    const cacheKey = `matching:${quoteData.quoteId}:${productIds.map((p) => p.toString()).join(',')}`;
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for quote ${quoteData.quoteId}`);
        return JSON.parse(cached);
      }
    } catch {
      // Cache miss or error, continue with DB query
    }

    const retailerProductsCollection = this.connection.collection('retailer_products');
    const pipeline: any[] = [
      // Stage 1: Match retailer_products with matching productIds, active, in stock
      {
        $match: {
          productId: { $in: productIds },
          isActive: true,
          availableStock: { $gt: 0 },
        },
      },
      // Stage 2: Lookup retailer info from retailers collection
      {
        $lookup: {
          from: 'retailers',
          let: { rid: '$retailerId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$rid'] },
                status: 'ACTIVE',
                kycStatus: 'APPROVED',
              },
            },
            {
              $project: {
                _id: 1,
                businessName: 1,
                avgRating: 1,
                totalSales: 1,
                acceptedPaymentMethods: 1,
              },
            },
          ],
          as: 'retailer',
        },
      },
      // Unwind retailer (only keep if found = ACTIVE + APPROVED)
      {
        $unwind: '$retailer',
      },
      // Stage 3: Filter by serviceRegions covering farmer's stateProvince
      {
        $match: {
          'serviceRegions.stateProvince': farmerStateProvince,
        },
      },
    ];

    // Stage 4: Filter by preferred payment method if specified
    if (quoteData.preferredPaymentMethod) {
      pipeline.push({
        $match: {
          'retailer.acceptedPaymentMethods': quoteData.preferredPaymentMethod,
        },
      });
    }

    // Group by retailer, collect matched products
    pipeline.push(
      {
        $group: {
          _id: '$retailerId',
          retailerName: { $first: '$retailer.businessName' },
          avgRating: { $first: { $ifNull: ['$retailer.avgRating', 0] } },
          totalSales: { $first: { $ifNull: ['$retailer.totalSales', 0] } },
          matchedProducts: {
            $push: {
              productId: '$productId',
              unitPrice: '$unitPrice',
              availableStock: '$availableStock',
            },
          },
        },
      },
      // Stage 5: Sort by avgRating desc, totalSales desc
      {
        $sort: { avgRating: -1, totalSales: -1 },
      },
      // Stage 6: Limit to MAX_RETAILERS_PER_QUOTE
      {
        $limit: MAX_RETAILERS_PER_QUOTE,
      },
      // Project final shape
      {
        $project: {
          _id: 0,
          retailerId: { $toString: '$_id' },
          retailerName: 1,
          avgRating: 1,
          totalSales: 1,
          matchedProducts: 1,
        },
      },
    );

    const results = await retailerProductsCollection
      .aggregate<EligibleRetailer>(pipeline)
      .toArray();

    // Cache result for 5 minutes
    try {
      await this.redis.set(cacheKey, JSON.stringify(results), 'EX', REDIS_CACHE_TTL);
    } catch {
      // Cache write failure is non-critical
    }

    this.logger.log(
      `Found ${results.length} eligible retailers for quote ${quoteData.quoteId}`,
    );

    return results;
  }

  async processQuoteCreated(quoteData: QuoteData): Promise<void> {
    const eligibleRetailers = await this.findEligibleRetailers(quoteData);

    if (eligibleRetailers.length === 0) {
      this.logger.warn(
        `No eligible retailers found for quote ${quoteData.quoteId}`,
      );

      // Notify farmer that no retailers are available
      await this.rabbitmqService.publish('matching.no_retailers_found', {
        quoteId: quoteData.quoteId,
        farmerId: quoteData.farmerId,
        message: 'No retailers available for your quote at this time',
        processedAt: new Date().toISOString(),
      });
      return;
    }

    const retailerIds = eligibleRetailers.map((r) => r.retailerId);

    // Publish retailerIds for notification service
    await this.rabbitmqService.publish('matching.retailers_found', {
      quoteId: quoteData.quoteId,
      farmerId: quoteData.farmerId,
      retailerIds,
      retailerCount: retailerIds.length,
      matchedAt: new Date().toISOString(),
    });

    this.logger.log(
      `Published ${retailerIds.length} eligible retailer(s) for quote ${quoteData.quoteId}`,
    );
  }

  async getMatchingResult(quoteId: string): Promise<{
    quoteId: string;
    retailers: EligibleRetailer[];
    fromCache: boolean;
  }> {
    // Try to get from cache first
    try {
      const keys = await this.redis.keys(`matching:${quoteId}:*`);
      if (keys.length > 0) {
        const cached = await this.redis.get(keys[0]);
        if (cached) {
          return {
            quoteId,
            retailers: JSON.parse(cached),
            fromCache: true,
          };
        }
      }
    } catch {
      // Cache error, return empty
    }

    return {
      quoteId,
      retailers: [],
      fromCache: false,
    };
  }
}
