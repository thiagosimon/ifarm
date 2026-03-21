import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerDocument> {
    const existing = await this.customerModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('A customer with this email already exists');
    }

    const customer = new this.customerModel({
      ...dto,
      email: dto.email.toLowerCase(),
    });

    const saved = await customer.save();
    this.logger.log(`Customer created: ${saved._id}`);
    return saved;
  }

  async findAll(retailerId?: string): Promise<CustomerDocument[]> {
    const query = retailerId ? { retailerId } : {};
    return this.customerModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<CustomerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid customer ID format');
    }
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid customer ID format');
    }

    const updateData: Record<string, any> = { ...dto };
    if (dto.email) {
      updateData.email = dto.email.toLowerCase();
    }

    const customer = await this.customerModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    this.logger.log(`Customer updated: ${id}`);
    return customer;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid customer ID format');
    }

    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    this.logger.log(`Customer deleted: ${id}`);
  }
}
