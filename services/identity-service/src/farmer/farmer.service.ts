import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Farmer, FarmerDocument, FarmerStatus, KycStatus, KycDocumentStatus } from './schemas/farmer.schema';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { CryptoService } from '../crypto/crypto.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { SerproAdapter } from '../serpro/serpro.adapter';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class FarmerService {
  private readonly logger = new Logger(FarmerService.name);

  constructor(
    @InjectModel(Farmer.name)
    private readonly farmerModel: Model<FarmerDocument>,
    private readonly cryptoService: CryptoService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly serproAdapter: SerproAdapter,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateFarmerDto): Promise<FarmerDocument> {
    if (!dto.consentHistory || dto.consentHistory.length === 0) {
      throw new BadRequestException(
        'At least one consent record is required (RLGPD-001)',
      );
    }

    const existingFarmer = await this.farmerModel
      .findOne({ email: dto.email.toLowerCase() })
      .exec();
    if (existingFarmer) {
      throw new ConflictException('A farmer with this email already exists');
    }

    const { ciphertext, iv, authTag } = this.cryptoService.encrypt(
      dto.federalTaxId,
    );

    const farmer = new this.farmerModel({
      externalAuthId: dto.externalAuthId || null,
      fullName: dto.fullName,
      federalTaxId: ciphertext,
      federalTaxIdIv: iv,
      federalTaxIdAuthTag: authTag,
      email: dto.email.toLowerCase(),
      phoneNumber: dto.phoneNumber,
      preferredLanguage: dto.preferredLanguage || 'pt-BR',
      countryCode: dto.countryCode || 'BR',
      farmName: dto.farmName || null,
      farmAddress: dto.farmAddress || {},
      status: FarmerStatus.PENDING,
      kycStatus: KycStatus.NOT_STARTED,
      kycDocuments: [],
      taxValidation: {
        isValidated: false,
        isPending: true,
        legalName: null,
        validatedAt: null,
      },
      consentHistory: dto.consentHistory.map((c) => ({
        acceptedAt: new Date(c.acceptedAt),
        termsVersion: c.termsVersion,
        ipAddress: c.ipAddress,
        deviceId: c.deviceId || null,
      })),
      paymentPreferences: { preferredMethod: 'PIX' },
      schemaVersion: 1,
      deletedAt: null,
    });

    const savedFarmer = await farmer.save();

    await this.rabbitmqService.publish('identity.events', 'identity.farmer.registered', {
      farmerId: savedFarmer._id.toString(),
      email: savedFarmer.email,
      fullName: savedFarmer.fullName,
      status: savedFarmer.status,
      registeredAt: new Date().toISOString(),
    });

    this.validateFederalTaxIdAsync(savedFarmer._id.toString(), dto.federalTaxId);

    this.logger.log(`Farmer registered: ${savedFarmer._id}`);
    return savedFarmer;
  }

  async findById(id: string): Promise<FarmerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid farmer ID format');
    }

    const farmer = await this.farmerModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!farmer) {
      throw new NotFoundException(`Farmer with id ${id} not found`);
    }
    return farmer;
  }

  async update(id: string, dto: UpdateFarmerDto): Promise<FarmerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid farmer ID format');
    }

    const updateData: Record<string, any> = { ...dto };

    if (dto.consentHistory) {
      updateData.$push = {
        consentHistory: {
          $each: dto.consentHistory.map((c) => ({
            acceptedAt: new Date(c.acceptedAt),
            termsVersion: c.termsVersion,
            ipAddress: c.ipAddress,
            deviceId: c.deviceId || null,
          })),
        },
      };
      delete updateData.consentHistory;
    }

    if (dto.email) {
      updateData.email = dto.email.toLowerCase();
    }

    const farmer = await this.farmerModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!farmer) {
      throw new NotFoundException(`Farmer with id ${id} not found`);
    }

    this.logger.log(`Farmer updated: ${id}`);
    return farmer;
  }

  async anonymize(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid farmer ID format');
    }

    const farmer = await this.farmerModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          fullName: 'Anonymized',
          email: `anon_${id}@deleted.ifarm.com.br`,
          phoneNumber: null,
          federalTaxId: null,
          federalTaxIdIv: null,
          federalTaxIdAuthTag: null,
          externalAuthId: null,
          farmName: null,
          farmAddress: {},
          status: FarmerStatus.DEACTIVATED,
          deletedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!farmer) {
      throw new NotFoundException(`Farmer with id ${id} not found`);
    }

    await this.rabbitmqService.publish('identity.events', 'identity.farmer.anonymized', {
      farmerId: id,
      anonymizedAt: new Date().toISOString(),
    });

    this.logger.log(`Farmer anonymized (LGPD): ${id}`);
    return { message: 'Personal data has been anonymized per LGPD right to be forgotten' };
  }

  async exportData(id: string): Promise<Record<string, any>> {
    const farmer = await this.findById(id);

    const exportPayload: Record<string, any> = {
      id: farmer._id.toString(),
      fullName: farmer.fullName,
      email: farmer.email,
      phoneNumber: farmer.phoneNumber,
      preferredLanguage: farmer.preferredLanguage,
      countryCode: farmer.countryCode,
      farmName: farmer.farmName,
      farmAddress: farmer.farmAddress,
      status: farmer.status,
      kycStatus: farmer.kycStatus,
      kycDocuments: farmer.kycDocuments.map((d) => ({
        documentType: d.documentType,
        uploadedAt: d.uploadedAt,
        status: d.status,
      })),
      taxValidation: {
        isValidated: farmer.taxValidation?.isValidated,
        legalName: farmer.taxValidation?.legalName,
        validatedAt: farmer.taxValidation?.validatedAt,
      },
      consentHistory: farmer.consentHistory,
      paymentPreferences: farmer.paymentPreferences,
      exportedAt: new Date().toISOString(),
    };

    this.logger.log(`Farmer data exported (LGPD portability): ${id}`);
    return exportPayload;
  }

  async uploadDocument(
    farmerId: string,
    documentType: string,
    file: Express.Multer.File,
  ): Promise<FarmerDocument> {
    const farmer = await this.findById(farmerId);

    const s3Key = await this.storageService.uploadDocument(
      `farmers/${farmerId}`,
      file,
    );

    const updatedFarmer = await this.farmerModel
      .findOneAndUpdate(
        { _id: farmerId },
        {
          $push: {
            kycDocuments: {
              documentType,
              s3Key,
              uploadedAt: new Date(),
              status: KycDocumentStatus.UPLOADED,
            },
          },
          kycStatus: KycStatus.DOCUMENTS_SUBMITTED,
        },
        { new: true },
      )
      .exec();

    if (!updatedFarmer) {
      throw new NotFoundException(`Farmer with id ${farmerId} not found`);
    }

    await this.rabbitmqService.publish('identity.events', 'identity.farmer.document_uploaded', {
      farmerId,
      documentType,
      s3Key,
      uploadedAt: new Date().toISOString(),
    });

    this.logger.log(`Document uploaded for farmer ${farmerId}: ${documentType}`);
    return updatedFarmer;
  }

  async getDocumentPresignedUrl(
    farmerId: string,
    documentIndex: number,
  ): Promise<{ url: string; expiresIn: number }> {
    const farmer = await this.findById(farmerId);

    if (!farmer.kycDocuments[documentIndex]) {
      throw new NotFoundException(
        `Document at index ${documentIndex} not found for farmer ${farmerId}`,
      );
    }

    const doc = farmer.kycDocuments[documentIndex];
    const url = await this.storageService.getPresignedUrl(doc.s3Key);

    return {
      url,
      expiresIn: parseInt(process.env.S3_PRESIGNED_URL_TTL_SECONDS || '900', 10),
    };
  }

  async findByKycStatus(kycStatus: KycStatus): Promise<FarmerDocument[]> {
    return this.farmerModel
      .find({ kycStatus, deletedAt: null })
      .select('-federalTaxId -federalTaxIdIv -federalTaxIdAuthTag')
      .exec();
  }

  async updateKycStatus(
    id: string,
    kycStatus: KycStatus,
  ): Promise<FarmerDocument> {
    const update: Record<string, any> = { kycStatus };

    if (kycStatus === KycStatus.APPROVED) {
      update.status = FarmerStatus.ACTIVE;
    }

    const farmer = await this.farmerModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, update, { new: true })
      .exec();

    if (!farmer) {
      throw new NotFoundException(`Farmer with id ${id} not found`);
    }

    await this.rabbitmqService.publish('identity.events', 'identity.farmer.kyc_updated', {
      farmerId: id,
      kycStatus,
      updatedAt: new Date().toISOString(),
    });

    return farmer;
  }

  private async validateFederalTaxIdAsync(
    farmerId: string,
    rawTaxId: string,
  ): Promise<void> {
    try {
      const result = await this.serproAdapter.validateCpf(rawTaxId);

      await this.farmerModel
        .findByIdAndUpdate(farmerId, {
          taxValidation: {
            isValidated: true,
            isPending: false,
            legalName: result.nome || null,
            validatedAt: new Date(),
          },
        })
        .exec();

      this.logger.log(`Tax ID validated for farmer ${farmerId}`);
    } catch (error) {
      this.logger.warn(
        `Tax ID validation failed for farmer ${farmerId}, will retry later: ${(error as Error).message}`,
      );

      await this.farmerModel
        .findByIdAndUpdate(farmerId, {
          'taxValidation.isPending': true,
          'taxValidation.isValidated': false,
        })
        .exec();
    }
  }
}
