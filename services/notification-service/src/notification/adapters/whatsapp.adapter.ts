import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface WhatsAppMessagePayload {
  phoneNumber: string;
  templateName: string;
  languageCode?: string;
  parameters: Array<{ type: 'text'; text: string }>;
}

@Injectable()
export class WhatsAppAdapter {
  private readonly logger = new Logger(WhatsAppAdapter.name);
  private readonly phoneId: string;
  private readonly token: string;
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.phoneId = process.env.WHATSAPP_PHONE_ID || '';
    this.token = process.env.WHATSAPP_TOKEN || '';
  }

  async sendTemplate(payload: WhatsAppMessagePayload): Promise<{ messageId: string }> {
    const { phoneNumber, templateName, languageCode, parameters } = payload;

    this.logger.log(
      `Sending WhatsApp template "${templateName}" to ${phoneNumber}`,
    );

    const requestBody = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode || 'pt_BR',
        },
        components: [
          {
            type: 'body',
            parameters: parameters.map((p) => ({
              type: p.type,
              text: p.text,
            })),
          },
        ],
      },
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneId}/messages`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      const messageId =
        response.data?.messages?.[0]?.id || 'unknown';
      this.logger.log(
        `WhatsApp message sent successfully. Message ID: ${messageId}`,
      );
      return { messageId };
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || error.message || 'Unknown error';
      this.logger.error(`WhatsApp send failed: ${message}`);
      throw new Error(`WhatsApp send failed: ${message}`);
    }
  }
}
