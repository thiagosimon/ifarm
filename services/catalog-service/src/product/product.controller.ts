import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { RetailerProductService } from './retailer-product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  AddToRetailerCatalogDto,
  UpdateRetailerProductDto,
} from './dto/retailer-product.dto';

@Controller('v1')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly retailerProductService: RetailerProductService,
  ) {}

  // ─── Product Endpoints ────────────────────────────────────

  @Get('products')
  async findAll(
    @Query('category') category?: string,
    @Query('stateProvince') stateProvince?: string,
    @Query('isRuralCreditEligible') isRuralCreditEligible?: string,
    @Query('q') q?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.productService.findAll({
      category,
      stateProvince,
      isRuralCreditEligible,
      q,
      page,
      limit,
    });
    return {
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Get('products/:id')
  async findById(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProductDto,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    const product = await this.productService.create(dto, userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product created successfully',
      data: {
        id: product._id,
        name: product.name,
        category: product.category,
        status: product.status,
      },
    };
  }

  @Patch('products/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    const product = await this.productService.update(id, dto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Post('products/:id/images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10))
  async addImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }
    const product = await this.productService.addImages(id, userId, files);
    return {
      statusCode: HttpStatus.CREATED,
      message: `${files.length} image(s) added successfully`,
      data: {
        id: product._id,
        imagesCount: product.images.length,
      },
    };
  }

  // ─── Retailer Catalog Endpoints ───────────────────────────

  @Post('retailers/:id/catalog')
  @HttpCode(HttpStatus.CREATED)
  async addToRetailerCatalog(
    @Param('id') retailerId: string,
    @Body() dto: AddToRetailerCatalogDto,
  ) {
    const entry = await this.retailerProductService.addToRetailerCatalog(
      retailerId,
      dto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product added to retailer catalog',
      data: entry,
    };
  }

  @Get('retailers/:id/catalog')
  async getRetailerCatalog(
    @Param('id') retailerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActive?: string,
  ) {
    const result = await this.retailerProductService.getRetailerCatalog(
      retailerId,
      { page, limit, isActive },
    );
    return {
      statusCode: HttpStatus.OK,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Patch('retailers/:id/catalog/:productId')
  async updateRetailerProduct(
    @Param('id') retailerId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateRetailerProductDto,
  ) {
    const entry = await this.retailerProductService.updateRetailerProduct(
      retailerId,
      productId,
      dto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Retailer product updated successfully',
      data: entry,
    };
  }
}
