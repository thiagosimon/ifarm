import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../product/schemas/category.schema';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: {
    name: string;
    slug: string;
    parentId?: string;
    icon?: string;
    sortOrder?: number;
  }): Promise<CategoryDocument> {
    // Check slug uniqueness
    const existing = await this.categoryModel
      .findOne({ slug: dto.slug.toLowerCase() })
      .exec();
    if (existing) {
      throw new ConflictException(`Category with slug '${dto.slug}' already exists`);
    }

    let path: string;
    let level: number;
    let parentId: Types.ObjectId | null = null;

    if (dto.parentId) {
      if (!Types.ObjectId.isValid(dto.parentId)) {
        throw new BadRequestException('Invalid parentId format');
      }

      const parent = await this.categoryModel.findById(dto.parentId).exec();
      if (!parent) {
        throw new NotFoundException(`Parent category with id ${dto.parentId} not found`);
      }

      parentId = new Types.ObjectId(dto.parentId);
      path = `${parent.path}.${dto.slug.toUpperCase().replace(/-/g, '_')}`;
      level = parent.level + 1;
    } else {
      path = dto.slug.toUpperCase().replace(/-/g, '_');
      level = 0;
    }

    const category = new this.categoryModel({
      name: dto.name,
      slug: dto.slug.toLowerCase(),
      parentId,
      path,
      level,
      isActive: true,
      icon: dto.icon || '',
      sortOrder: dto.sortOrder || 0,
    });

    const saved = await category.save();
    this.logger.log(`Category created: ${saved._id} (${saved.path})`);
    return saved;
  }

  async findAll(query: {
    parentId?: string;
    isActive?: string;
  }): Promise<CategoryDocument[]> {
    const filter: Record<string, any> = {};

    if (query.parentId === 'null' || query.parentId === '') {
      filter.parentId = null;
    } else if (query.parentId) {
      if (!Types.ObjectId.isValid(query.parentId)) {
        throw new BadRequestException('Invalid parentId format');
      }
      filter.parentId = new Types.ObjectId(query.parentId);
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true' || query.isActive === '1';
    }

    return this.categoryModel
      .find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findById(id: string): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID format');
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async getTree(rootId?: string): Promise<CategoryDocument[]> {
    const filter: Record<string, any> = { isActive: true };

    if (rootId) {
      if (!Types.ObjectId.isValid(rootId)) {
        throw new BadRequestException('Invalid category ID format');
      }
      const root = await this.categoryModel.findById(rootId).exec();
      if (!root) {
        throw new NotFoundException(`Category with id ${rootId} not found`);
      }
      // Match all descendants using materialized path prefix
      filter.path = { $regex: `^${root.path}` };
    }

    return this.categoryModel
      .find(filter)
      .sort({ path: 1, sortOrder: 1 })
      .exec();
  }

  async update(
    id: string,
    dto: {
      name?: string;
      icon?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID format');
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec();

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    this.logger.log(`Category updated: ${id}`);
    return category;
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid category ID format');
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // Check for children
    const childCount = await this.categoryModel
      .countDocuments({ parentId: new Types.ObjectId(id) })
      .exec();

    if (childCount > 0) {
      throw new ConflictException(
        'Cannot delete category with children. Remove or reassign children first.',
      );
    }

    await this.categoryModel.findByIdAndDelete(id).exec();
    this.logger.log(`Category deleted: ${id}`);
    return { message: 'Category deleted successfully' };
  }
}
