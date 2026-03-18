import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    dto: {
      name: string;
      slug: string;
      parentId?: string;
      icon?: string;
      sortOrder?: number;
    },
  ) {
    const category = await this.categoryService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get()
  async findAll(
    @Query('parentId') parentId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const categories = await this.categoryService.findAll({
      parentId,
      isActive,
    });
    return {
      statusCode: HttpStatus.OK,
      data: categories,
    };
  }

  @Get('tree')
  async getTree(@Query('rootId') rootId?: string) {
    const tree = await this.categoryService.getTree(rootId);
    return {
      statusCode: HttpStatus.OK,
      data: tree,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const category = await this.categoryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data: category,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      icon?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    const category = await this.categoryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category updated successfully',
      data: category,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.categoryService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
