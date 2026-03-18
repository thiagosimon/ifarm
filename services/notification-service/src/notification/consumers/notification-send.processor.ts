import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationService } from '../notification.service';

const BACKOFF_DELAYS = [60_000, 300_000, 1_800_000]; // 1min, 5min, 30min

@Processor('notification-send')
export class NotificationSendProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationSendProcessor.name);

  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(
      `Processing notification job ${job.id} | attempt ${job.attemptsMade + 1}`,
    );

    try {
      await this.notificationService.processNotificationSend(job.data);
      this.logger.log(`Notification job ${job.id} completed`);
    } catch (error: any) {
      this.logger.error(
        `Notification job ${job.id} failed: ${error.message}`,
      );

      if (job.attemptsMade + 1 < 3) {
        const delay = BACKOFF_DELAYS[job.attemptsMade] || 1_800_000;
        this.logger.log(
          `Will retry job ${job.id} in ${delay / 1000}s`,
        );
        throw error;
      }

      this.logger.error(
        `Notification job ${job.id} exhausted all attempts, moved to DLQ`,
      );
      throw error;
    }
  }
}
