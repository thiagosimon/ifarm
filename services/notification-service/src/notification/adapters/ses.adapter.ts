import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
}

@Injectable()
export class SesAdapter {
  private readonly logger = new Logger(SesAdapter.name);
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;

  constructor() {
    this.fromEmail =
      process.env.AWS_SES_FROM_EMAIL || 'noreply@ifarm.com.br';

    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || 'sa-east-1',
      ...(process.env.AWS_ACCESS_KEY_ID && {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      }),
    });
  }

  async sendEmail(payload: EmailPayload): Promise<{ messageId: string }> {
    const { to, subject, htmlBody } = payload;

    this.logger.log(`Sending email to ${to}: "${subject}"`);

    const command = new SendEmailCommand({
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    try {
      const response = await this.sesClient.send(command);
      const messageId = response.MessageId || 'unknown';
      this.logger.log(`Email sent successfully. SES Message ID: ${messageId}`);
      return { messageId };
    } catch (error: any) {
      const message = error.message || 'Unknown error';
      this.logger.error(`SES email send failed: ${message}`);
      throw new Error(`SES email send failed: ${message}`);
    }
  }
}
