import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RetailerService } from './retailer.service';
import { CreateRetailerDto } from './dto/create-retailer.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';

@Controller('v1/retailers')
export class RetailerController {
  constructor(private readonly retailerService: RetailerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRetailerDto) {
    const retailer = await this.retailerService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Retailer registered successfully',
      data: {
        id: retailer._id,
        businessName: retailer.businessName,
        email: retailer.email,
        status: retailer.status,
        kycStatus: retailer.kycStatus,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const retailer = await this.retailerService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data: retailer,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRetailerDto) {
    const retailer = await this.retailerService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Retailer updated successfully',
      data: retailer,
    };
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!documentType) {
      throw new BadRequestException('documentType is required');
    }

    const retailer = await this.retailerService.uploadDocument(
      id,
      documentType,
      file,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Document uploaded successfully',
      data: {
        id: retailer._id,
        kycStatus: retailer.kycStatus,
        documentsCount: retailer.kycDocuments.length,
      },
    };
  }
}
