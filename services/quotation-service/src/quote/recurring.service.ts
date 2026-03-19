import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RecurringConfig,
  RecurringConfigDocument,
  RecurringFrequency,
  RecurringStatus,
} from './schemas/recurring-config.schema';
import {
  CreateRecurringDto,
  UpdateRecurringDto,
} from './dto/create-recurring.dto';

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(
    @InjectModel(RecurringConfig.name)
    private readonly recurringConfigModel: Model<RecurringConfigDocument>,
  ) {}

  /**
   * Create a new recurring quote configuration.
   */
  async create(dto: CreateRecurringDto): Promise<RecurringConfigDocument> {
    const nextFireAt = this.calculateNextFireAt(
      dto.frequency,
      dto.customIntervalDays,
    );

    const config = new this.recurringConfigModel({
      farmerId: new Types.ObjectId(dto.farmerId),
      productId: new Types.ObjectId(dto.productId),
      productSnapshot: dto.productSnapshot,
      quantity: dto.quantity,
      measurementUnit: dto.measurementUnit,
      frequency: dto.frequency,
      customIntervalDays: dto.customIntervalDays || null,
      maxAcceptPrice: dto.maxAcceptPrice ?? null,
      autoAccept: dto.autoAccept ?? false,
      status: RecurringStatus.ACTIVE,
      nextFireAt,
      deliveryMode: dto.deliveryMode,
      deliveryAddress: dto.deliveryAddress || null,
      preferredPaymentMethod: dto.preferredPaymentMethod,
    });

    const saved = await config.save();
    this.logger.log(`Recurring config created: ${saved._id}`);
    return saved;
  }

  /**
   * List recurring configs for a farmer (paginated).
   */
  async findByFarmer(
    farmerId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: RecurringConfigDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const filter = { farmerId: new Types.ObjectId(farmerId) };

    const [data, total] = await Promise.all([
      this.recurringConfigModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.recurringConfigModel.countDocuments(filter).exec(),
    ]);

    return {
      data: data as unknown as RecurringConfigDocument[],
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  /**
   * Update an existing recurring configuration.
   */
  async update(
    configId: string,
    farmerId: string,
    dto: UpdateRecurringDto,
  ): Promise<RecurringConfigDocument> {
    const config = await this.recurringConfigModel
      .findOne({
        _id: new Types.ObjectId(configId),
        farmerId: new Types.ObjectId(farmerId),
      })
      .exec();

    if (!config) {
      throw new NotFoundException(
        `Recurring config ${configId} not found for farmer ${farmerId}`,
      );
    }

    // Apply updates
    if (dto.frequency !== undefined) {
      config.frequency = dto.frequency;
    }
    if (dto.customIntervalDays !== undefined) {
      config.customIntervalDays = dto.customIntervalDays;
    }
    if (dto.quantity !== undefined) {
      config.quantity = dto.quantity;
    }
    if (dto.maxAcceptPrice !== undefined) {
      config.maxAcceptPrice = dto.maxAcceptPrice;
    }
    if (dto.autoAccept !== undefined) {
      config.autoAccept = dto.autoAccept;
    }
    if (dto.status !== undefined) {
      if (
        Object.values(RecurringStatus).includes(
          dto.status as RecurringStatus,
        )
      ) {
        config.status = dto.status as RecurringStatus;
      }
    }

    // Recalculate nextFireAt if frequency changed
    if (dto.frequency !== undefined || dto.customIntervalDays !== undefined) {
      config.nextFireAt = this.calculateNextFireAt(
        config.frequency,
        config.customIntervalDays,
      );
    }

    const updated = await config.save();
    this.logger.log(`Recurring config updated: ${configId}`);
    return updated;
  }

  /**
   * Calculate the next fire timestamp based on frequency.
   */
  calculateNextFireAt(
    frequency: RecurringFrequency,
    customIntervalDays?: number | null,
    fromDate?: Date,
  ): Date {
    const base = fromDate ? new Date(fromDate) : new Date();

    switch (frequency) {
      case RecurringFrequency.WEEKLY:
        base.setDate(base.getDate() + 7);
        break;
      case RecurringFrequency.BIWEEKLY:
        base.setDate(base.getDate() + 14);
        break;
      case RecurringFrequency.MONTHLY:
        base.setMonth(base.getMonth() + 1);
        break;
      case RecurringFrequency.CUSTOM:
        if (customIntervalDays && customIntervalDays > 0) {
          base.setDate(base.getDate() + customIntervalDays);
        } else {
          // Default to 30 days if custom interval not specified
          base.setDate(base.getDate() + 30);
        }
        break;
    }

    // Normalize to 08:00 UTC for consistency
    base.setUTCHours(8, 0, 0, 0);
    return base;
  }

  /**
   * Find all active configs that are due for firing.
   * Used by the recurring processor job.
   */
  async findDueConfigs(): Promise<RecurringConfigDocument[]> {
    const now = new Date();
    return this.recurringConfigModel
      .find({
        status: RecurringStatus.ACTIVE,
        nextFireAt: { $lte: now },
      })
      .exec();
  }

  /**
   * Update nextFireAt after a config has been processed.
   */
  async advanceNextFire(configId: string): Promise<void> {
    const config = await this.recurringConfigModel
      .findById(configId)
      .exec();

    if (!config) return;

    config.nextFireAt = this.calculateNextFireAt(
      config.frequency,
      config.customIntervalDays,
    );

    await config.save();
  }
}
