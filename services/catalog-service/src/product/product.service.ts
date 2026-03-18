import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductDocument, ProductStatus } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

const REDIS_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly s3Client: S3Client;
  private readonly redis: Redis;
  private readonly s3Bucket: string;

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly rabbitmqService: RabbitmqService,
  ) {
    this.s3Bucket = process.env.S3_BUCKET || 'ifarm-catalog-images';
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'sa-east-1',
    });
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });
    this.redis.connect().catch((err) => {
      this.logger.warn(`Redis connection failed (cache disabled): ${err.message}`);
    });
  }

  async create(
    dto: CreateProductDto,
    createdBy: string,
  ): Promise<ProductDocument> {
    if (!/^\d{8}$/.test(dto.tariffCode)) {
      throw new UnprocessableEntityException(
        'tariffCode must be exactly 8 digits (RCQ-001)',
      );
    }

    const product = new this.productModel({
      name: dto.name,
      description: dto.description || '',
      brand: dto.brand || '',
      category: dto.category,
      tariffCode: dto.tariffCode,
      cestCode: dto.cestCode || null,
      cfopCode: dto.cfopCode,
      originCode: dto.originCode,
      isRuralCreditEligible: dto.isRuralCreditEligible,
      measurementUnit: dto.measurementUnit,
      tags: dto.tags || [],
      images: [],
      attributes: dto.attributes || [],
      status: ProductStatus.DRAFT,
      createdBy,
      schemaVersion: 1,
    });

    const saved = await product.save();
    this.logger.log(`Product created: ${saved._id}`);
    return saved;
  }

  async findAll(query: {
    category?: string;
    stateProvince?: string;
    isRuralCreditEligible?: string;
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: ProductDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    // Check cache for popular listings
    const cacheKey = `catalog:products:${JSON.stringify(query)}`;
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit: ${cacheKey}`);
        return JSON.parse(cached);
      }
    } catch {
      // Cache miss or error, continue with DB query
    }

    const filter: FilterQuery<ProductDocument> = {
      status: ProductStatus.ACTIVE,
    };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.isRuralCreditEligible !== undefined) {
      filter.isRuralCreditEligible =
        query.isRuralCreditEligible === 'true' || query.isRuralCreditEligible === '1';
    }

    if (query.status) {
      filter.status = query.status;
    }

    let sortOption: Record<string, any> = { createdAt: -1 };

    if (query.q) {
      filter.$text = { $search: query.q };
      sortOption = { score: { $meta: 'textScore' } };
    }

    const [data, total] = await Promise.all([
      query.q
        ? this.productModel
            .find(filter, { score: { $meta: 'textScore' } })
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .exec()
        : this.productModel
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    const result = { data, total, page, limit };

    // Cache popular listings for 5 minutes
    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', REDIS_CACHE_TTL);
    } catch {
      // Cache write failure is non-critical
    }

    return result;
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    requesterId: string,
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    if (dto.tariffCode && !/^\d{8}$/.test(dto.tariffCode)) {
      throw new UnprocessableEntityException(
        'tariffCode must be exactly 8 digits (RCQ-001)',
      );
    }

    const product = await this.productModel
      .findOneAndUpdate(
        { _id: id, createdBy: requesterId },
        { $set: dto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} not found or you are not the owner`,
      );
    }

    // If name, tariffCode, or category changed, publish update event
    if (dto.name || dto.tariffCode || dto.category) {
      await this.rabbitmqService.publish('catalog.product.updated', {
        productId: product._id.toString(),
        name: product.name,
        category: product.category,
        tariffCode: product.tariffCode,
        measurementUnit: product.measurementUnit,
        updatedAt: new Date().toISOString(),
      });
    }

    // Invalidate related caches
    await this.invalidateProductCaches();

    this.logger.log(`Product updated: ${id}`);
    return product;
  }

  async addImages(
    id: string,
    requesterId: string,
    files: Express.Multer.File[],
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productModel
      .findOne({ _id: id, createdBy: requesterId })
      .exec();

    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} not found or you are not the owner`,
      );
    }

    const imageEntries: Array<{ url: string; s3Key: string; isPrimary: boolean }> = [];

    for (const file of files) {
      const s3Key = `products/${id}/${uuidv4()}-${file.originalname}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.s3Bucket,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${this.s3Bucket}.s3.${process.env.AWS_REGION || 'sa-east-1'}.amazonaws.com/${s3Key}`;
      const isPrimary = product.images.length === 0 && imageEntries.length === 0;

      imageEntries.push({ url, s3Key, isPrimary });
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        { $push: { images: { $each: imageEntries } } },
        { new: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    this.logger.log(
      `Added ${imageEntries.length} images to product ${id}`,
    );
    return updatedProduct;
  }

  private async invalidateProductCaches(): Promise<void> {
    try {
      const keys = await this.redis.keys('catalog:products:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch {
      // Cache invalidation failure is non-critical
    }
  }
}
