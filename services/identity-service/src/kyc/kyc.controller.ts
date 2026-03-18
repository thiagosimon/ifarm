import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { KycService } from './kyc.service';

class KycRejectDto {
  reason: string;
  ownerType?: 'farmer' | 'retailer';
}

class KycApproveDto {
  ownerType?: 'farmer' | 'retailer';
}

@Controller('v1/admin/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('queue')
  async getQueue(@Query('status') status: string) {
    if (!status) {
      throw new BadRequestException('status query parameter is required');
    }

    const queue = await this.kycService.getQueue(status);
    return {
      statusCode: HttpStatus.OK,
      data: queue,
      meta: {
        total: queue.length,
        status,
      },
    };
  }

  @Patch(':ownerId/approve')
  async approve(
    @Param('ownerId') ownerId: string,
    @Body() body: KycApproveDto,
  ) {
    const result = await this.kycService.approve(ownerId, body.ownerType);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Patch(':ownerId/reject')
  async reject(
    @Param('ownerId') ownerId: string,
    @Body() body: KycRejectDto,
  ) {
    if (!body.reason) {
      throw new BadRequestException('reason is required for rejection');
    }

    const result = await this.kycService.reject(
      ownerId,
      body.reason,
      body.ownerType,
    );
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
