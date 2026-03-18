import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RetailerProduct,
  RetailerProductDocument,
} from './schemas/retailer-product.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import {
  AddToRetailerCatalogDto,
  UpdateRetailerProductDto,
} from './dto/retailer-product.dto';

@Injectable()
export class RetailerProductService {
  private readonly logger = new Logger(RetailerProductService.name);

  constructor(
    @InjectModel(RetailerProduct.name)
    private readonly retailerProductModel: Model<RetailerProductDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async addToRetailerCatalog(
    retailerId: string,
    dto: AddToRetailerCatalogDto,
  ): Promise<RetailerProductDocument> {
    if (!Types.ObjectId.isValid(retailerId)) {
      throw new BadRequestException('Invalid retailer ID format');
    }
    if (!Types.ObjectId.isValid(dto.productId)) {
      throw new BadRequestException('Invalid product ID format');
    }

    // Fetch the product to create a snapshot
    const product = await this.productModel.findById(dto.productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${dto.productId} not found`);
    }

    // Check for existing entry
    const existing = await this.retailerProductModel
      .findOne({
        productId: new Types.ObjectId(dto.productId),
        retailerId: new Types.ObjectId(retailerId),
      })
      .exec();

    if (existing) {
      throw new ConflictException(
        'This product is already in the retailer catalog',
      );
    }

    const retailerProduct = new this.retailerProductModel({
      productId: new Types.ObjectId(dto.productId),
      retailerId: new Types.ObjectId(retailerId),
      productSnapshot: {
        name: product.name,
        category: product.category,
        tariffCode: product.tariffCode,
        measurementUnit: product.measurementUnit,
      },
      unitPrice: dto.unitPrice,
      availableStock: dto.availableStock,
      minimumOrderQuantity: dto.minimumOrderQuantity || 1,
      isActive: true,
      serviceRegions: dto.serviceRegions || [],
      customAttributes: dto.customAttributes || [],
    });

    const saved = await retailerProduct.save();
    this.logger.log(
      `Product ${dto.productId} added to retailer ${retailerId} catalog`,
    );
    return saved;
  }

  async getRetailerCatalog(
    retailerId: string,
    query: { page?: number; limit?: number; isActive?: string },
  ): Promise<{
    data: RetailerProductDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (!Types.ObjectId.isValid(retailerId)) {
      throw new BadRequestException('Invalid retailer ID format');
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      retailerId: new Types.ObjectId(retailerId),
    };

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true' || query.isActive === '1';
    }

    const [data, total] = await Promise.all([
      this.retailerProductModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.retailerProductModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async updateRetailerProduct(
    retailerId: string,
    productId: string,
    dto: UpdateRetailerProductDto,
  ): Promise<RetailerProductDocument> {
    if (!Types.ObjectId.isValid(retailerId)) {
      throw new BadRequestException('Invalid retailer ID format');
    }
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const retailerProduct = await this.retailerProductModel
      .findOneAndUpdate(
        {
          productId: new Types.ObjectId(productId),
          retailerId: new Types.ObjectId(retailerId),
        },
        { $set: dto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!retailerProduct) {
      throw new NotFoundException(
        `Retailer product not found for retailer ${retailerId} and product ${productId}`,
      );
    }

    this.logger.log(
      `Retailer product updated: retailer=${retailerId}, product=${productId}`,
    );
    return retailerProduct;
  }
}
