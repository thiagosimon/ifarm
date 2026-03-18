import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('v1/admin/notifications/dlq')
  async getDlqNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

    const result = await this.notificationService.getDlqNotifications(
      pageNum,
      limitNum,
    );

    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @Get('v1/notifications/preferences')
  async getPreferences(
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }

    const preferences = await this.notificationService.getPreferences(userId);

    return {
      statusCode: HttpStatus.OK,
      data: preferences,
    };
  }

  @Patch('v1/notifications/preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Headers('x-user-id') userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    if (!userId) {
      throw new BadRequestException('x-user-id header is required');
    }

    const preferences = await this.notificationService.updatePreferences(
      userId,
      dto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Preferences updated successfully',
      data: preferences,
    };
  }
}
