import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface PushPayload {
  externalUserIds: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class OneSignalAdapter {
  private readonly logger = new Logger(OneSignalAdapter.name);
  private readonly appId: string;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://onesignal.com/api/v1';

  constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID || '';
    this.apiKey = process.env.ONESIGNAL_API_KEY || '';
  }

  async sendPush(payload: PushPayload): Promise<{ id: string }> {
    const { externalUserIds, title, body, data } = payload;

    this.logger.log(
      `Sending push to ${externalUserIds.length} recipient(s): "${title}"`,
    );

    const requestBody: Record<string, any> = {
      app_id: this.appId,
      include_external_user_ids: externalUserIds,
      headings: { en: title },
      contents: { en: body },
      channel_for_external_user_ids: 'push',
    };

    if (data) {
      requestBody.data = data;

      if (data.screen) {
        requestBody.url = `ifarm://${data.screen}`;
        if (data.entityId) {
          requestBody.url += `/${data.entityId}`;
        }
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/notifications`,
        requestBody,
        {
          headers: {
            Authorization: `Basic ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      const notificationId = response.data?.id || 'unknown';
      this.logger.log(`Push sent successfully. OneSignal ID: ${notificationId}`);
      return { id: notificationId };
    } catch (error: any) {
      const message =
        error.response?.data?.errors?.[0] || error.message || 'Unknown error';
      this.logger.error(`Push send failed: ${message}`);
      throw new Error(`OneSignal push failed: ${message}`);
    }
  }
}
