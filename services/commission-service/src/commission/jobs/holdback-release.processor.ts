import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CommissionService } from '../commission.service';

@Processor('holdback-release')
export class HoldbackReleaseProcessor extends WorkerHost {
  private readonly logger = new Logger(HoldbackReleaseProcessor.name);

  constructor(private readonly commissionService: CommissionService) {
    super();
  }

  /**
   * Process holdback release jobs.
   * Called automatically after the holdback delay period expires.
   */
  async process(job: Job<{ commissionId: string }>): Promise<void> {
    const { commissionId } = job.data;

    this.logger.log(`Processing holdback release for commission ${commissionId}`);

    try {
      const commission = await this.commissionService.findById(commissionId);

      if (!commission) {
        this.logger.error(`Commission ${commissionId} not found, skipping release`);
        return;
      }

      if (commission.status !== 'PENDING') {
        this.logger.warn(
          `Commission ${commissionId} is in status ${commission.status}, skipping release`,
        );
        return;
      }

      await this.commissionService.releaseCommission(commissionId);

      this.logger.log(`Holdback release completed for commission ${commissionId}`);
    } catch (error) {
      this.logger.error(
        `Failed to release commission ${commissionId}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
