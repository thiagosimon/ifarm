import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Controller('v1/farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFarmerDto) {
    const farmer = await this.farmerService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Farmer registered successfully',
      data: {
        id: farmer._id,
        fullName: farmer.fullName,
        email: farmer.email,
        status: farmer.status,
        kycStatus: farmer.kycStatus,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const farmer = await this.farmerService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data: farmer,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFarmerDto) {
    const farmer = await this.farmerService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Farmer updated successfully',
      data: farmer,
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

    const farmer = await this.farmerService.uploadDocument(
      id,
      documentType,
      file,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Document uploaded successfully',
      data: {
        id: farmer._id,
        kycStatus: farmer.kycStatus,
        documentsCount: farmer.kycDocuments.length,
      },
    };
  }

  @Get(':id/documents/:docIndex')
  async getDocumentPresignedUrl(
    @Param('id') id: string,
    @Param('docIndex') docIndex: string,
  ) {
    const index = parseInt(docIndex, 10);
    if (isNaN(index) || index < 0) {
      throw new BadRequestException('Invalid document index');
    }

    const result = await this.farmerService.getDocumentPresignedUrl(id, index);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('me')
  async anonymize(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }
    const result = await this.farmerService.anonymize(userId);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('me/export')
  async exportData(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }
    const data = await this.farmerService.exportData(userId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
