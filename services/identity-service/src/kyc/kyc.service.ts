import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FarmerService } from '../farmer/farmer.service';
import { RetailerService } from '../retailer/retailer.service';
import { KycStatus as FarmerKycStatus } from '../farmer/schemas/farmer.schema';
import { KycStatus as RetailerKycStatus } from '../retailer/schemas/retailer.schema';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

export interface KycQueueItem {
  ownerId: string;
  ownerType: 'farmer' | 'retailer';
  name: string;
  email: string;
  kycStatus: string;
  documentsCount: number;
  submittedAt: Date | null;
}

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private readonly farmerService: FarmerService,
    private readonly retailerService: RetailerService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async getQueue(status: string): Promise<KycQueueItem[]> {
    const kycStatus = status as FarmerKycStatus;
    const queue: KycQueueItem[] = [];

    const farmers = await this.farmerService.findByKycStatus(kycStatus);
    for (const farmer of farmers) {
      const latestDoc = farmer.kycDocuments.length > 0
        ? farmer.kycDocuments[farmer.kycDocuments.length - 1]
        : null;

      queue.push({
        ownerId: (farmer as any)._id.toString(),
        ownerType: 'farmer',
        name: farmer.fullName,
        email: farmer.email,
        kycStatus: farmer.kycStatus,
        documentsCount: farmer.kycDocuments.length,
        submittedAt: latestDoc ? latestDoc.uploadedAt : null,
      });
    }

    const retailers = await this.retailerService.findByKycStatus(
      kycStatus as unknown as RetailerKycStatus,
    );
    for (const retailer of retailers) {
      const latestDoc = retailer.kycDocuments.length > 0
        ? retailer.kycDocuments[retailer.kycDocuments.length - 1]
        : null;

      queue.push({
        ownerId: (retailer as any)._id.toString(),
        ownerType: 'retailer',
        name: retailer.businessName,
        email: retailer.email,
        kycStatus: retailer.kycStatus,
        documentsCount: retailer.kycDocuments.length,
        submittedAt: latestDoc ? latestDoc.uploadedAt : null,
      });
    }

    queue.sort((a, b) => {
      if (a.submittedAt && b.submittedAt) {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      return 0;
    });

    return queue;
  }

  async approve(
    ownerId: string,
    ownerType?: 'farmer' | 'retailer',
  ): Promise<{ message: string }> {
    const resolvedType = ownerType || (await this.resolveOwnerType(ownerId));

    if (resolvedType === 'farmer') {
      await this.farmerService.updateKycStatus(ownerId, FarmerKycStatus.APPROVED);
    } else if (resolvedType === 'retailer') {
      await this.retailerService.updateKycStatus(
        ownerId,
        RetailerKycStatus.APPROVED as unknown as RetailerKycStatus,
      );
    } else {
      throw new BadRequestException('Invalid ownerType. Must be "farmer" or "retailer"');
    }

    await this.rabbitmqService.publish('identity.events', 'identity.kyc.approved', {
      ownerId,
      ownerType: resolvedType,
      approvedAt: new Date().toISOString(),
    });

    this.logger.log(`KYC approved for ${resolvedType} ${ownerId}`);
    return { message: `KYC approved for ${resolvedType} ${ownerId}` };
  }

  async reject(
    ownerId: string,
    reason: string,
    ownerType?: 'farmer' | 'retailer',
  ): Promise<{ message: string }> {
    const resolvedType = ownerType || (await this.resolveOwnerType(ownerId));

    if (resolvedType === 'farmer') {
      await this.farmerService.updateKycStatus(ownerId, FarmerKycStatus.REJECTED);
    } else if (resolvedType === 'retailer') {
      await this.retailerService.updateKycStatus(
        ownerId,
        RetailerKycStatus.REJECTED as unknown as RetailerKycStatus,
      );
    } else {
      throw new BadRequestException('Invalid ownerType. Must be "farmer" or "retailer"');
    }

    await this.rabbitmqService.publish('identity.events', 'identity.kyc.rejected', {
      ownerId,
      ownerType: resolvedType,
      reason,
      rejectedAt: new Date().toISOString(),
    });

    this.logger.log(`KYC rejected for ${resolvedType} ${ownerId}: ${reason}`);
    return { message: `KYC rejected for ${resolvedType} ${ownerId}` };
  }

  private async resolveOwnerType(ownerId: string): Promise<'farmer' | 'retailer'> {
    try {
      await this.farmerService.findById(ownerId);
      return 'farmer';
    } catch {
      try {
        await this.retailerService.findById(ownerId);
        return 'retailer';
      } catch {
        throw new NotFoundException(
          `No farmer or retailer found with id ${ownerId}`,
        );
      }
    }
  }
}
