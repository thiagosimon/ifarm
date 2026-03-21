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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('v1/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.customerService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Customer created successfully',
      data: customer,
    };
  }

  @Get()
  async findAll(@Query('retailerId') retailerId?: string) {
    const customers = await this.customerService.findAll(retailerId);
    return {
      statusCode: HttpStatus.OK,
      data: customers,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const customer = await this.customerService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data: customer,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    const customer = await this.customerService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Customer updated successfully',
      data: customer,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.customerService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Customer deleted successfully',
    };
  }
}
