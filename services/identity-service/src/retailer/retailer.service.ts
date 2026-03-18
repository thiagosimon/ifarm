import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Retailer,
  RetailerDocument,
  RetailerStatus,
  KycStatus,
  KycDocumentStatus,
} from './schemas/retailer.schema';
import { CreateRetailerDto } from './dto/create-retailer.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';
import { CryptoService } from '../crypto/crypto.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { SerproAdapter } from '../serpro/serpro.adapter';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class RetailerService {
  private readonly logger = new Logger(RetailerService.name);

  constructor(
    @InjectModel(Retailer.name)
    private readonly retailerModel: Model<RetailerDocument>,
    private readonly cryptoService: CryptoService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly serproAdapter: SerproAdapter,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateRetailerDto): Promise<RetailerDocument> {
    if (!dto.consentHistory || dto.consentHistory.length === 0) {
      throw new BadRequestException(
        'At least one consent record is required (RLGPD-001)',
      );
    }

    const existingRetailer = await this.retailerModel
      .findOne({ email: dto.email.toLowerCase() })
      .exec();
    if (existingRetailer) {
      throw new ConflictException('A retailer with this email already exists');
    }

    const { ciphertext, iv, authTag } = this.cryptoService.encrypt(
      dto.businessRegistrationId,
    );

    const retailer = new this.retailerModel({
      externalAuthId: dto.externalAuthId || null,
      businessName: dto.businessName,
      tradeName: dto.tradeName || null,
      businessRegistrationId: ciphertext,
      businessRegistrationIdIv: iv,
      businessRegistrationIdAuthTag: authTag,
      responsiblePerson: dto.responsiblePerson,
      email: dto.email.toLowerCase(),
      phoneNumber: dto.phoneNumber,
      preferredLanguage: dto.preferredLanguage || 'pt-BR',
      countryCode: dto.countryCode || 'BR',
      address: dto.address || {},
      serviceRegions: dto.serviceRegions || [],
      paymentAccount: dto.paymentAccount || {},
      status: RetailerStatus.PENDING,
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
      avgRating: 0,
      totalReviews: 0,
      totalSales: 0,
      schemaVersion: 1,
      deletedAt: null,
    });

    const savedRetailer = await retailer.save();

    await this.rabbitmqService.publish(
      'identity.events',
      'identity.retailer.registered',
      {
        retailerId: savedRetailer._id.toString(),
        email: savedRetailer.email,
        businessName: savedRetailer.businessName,
        status: savedRetailer.status,
        registeredAt: new Date().toISOString(),
      },
    );

    this.validateBusinessRegistrationAsync(
      savedRetailer._id.toString(),
      dto.businessRegistrationId,
    );

    this.logger.log(`Retailer registered: ${savedRetailer._id}`);
    return savedRetailer;
  }

  async findById(id: string): Promise<RetailerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid retailer ID format');
    }

    const retailer = await this.retailerModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!retailer) {
      throw new NotFoundException(`Retailer with id ${id} not found`);
    }
    return retailer;
  }

  async update(id: string, dto: UpdateRetailerDto): Promise<RetailerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid retailer ID format');
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

    const retailer = await this.retailerModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!retailer) {
      throw new NotFoundException(`Retailer with id ${id} not found`);
    }

    this.logger.log(`Retailer updated: ${id}`);
    return retailer;
  }

  async anonymize(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid retailer ID format');
    }

    const retailer = await this.retailerModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          businessName: 'Anonymized',
          tradeName: null,
          businessRegistrationId: null,
          businessRegistrationIdIv: null,
          businessRegistrationIdAuthTag: null,
          responsiblePerson: { fullName: 'Anonymized', email: null, phoneNumber: null },
          email: `anon_${id}@deleted.ifarm.com.br`,
          phoneNumber: null,
          externalAuthId: null,
          address: {},
          status: RetailerStatus.DEACTIVATED,
          deletedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!retailer) {
      throw new NotFoundException(`Retailer with id ${id} not found`);
    }

    await this.rabbitmqService.publish(
      'identity.events',
      'identity.retailer.anonymized',
      {
        retailerId: id,
        anonymizedAt: new Date().toISOString(),
      },
    );

    this.logger.log(`Retailer anonymized (LGPD): ${id}`);
    return { message: 'Personal data has been anonymized per LGPD right to be forgotten' };
  }

  async uploadDocument(
    retailerId: string,
    documentType: string,
    file: Express.Multer.File,
  ): Promise<RetailerDocument> {
    const retailer = await this.findById(retailerId);

    const s3Key = await this.storageService.uploadDocument(
      `retailers/${retailerId}`,
      file,
    );

    const updatedRetailer = await this.retailerModel
      .findOneAndUpdate(
        { _id: retailerId },
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

    if (!updatedRetailer) {
      throw new NotFoundException(`Retailer with id ${retailerId} not found`);
    }

    await this.rabbitmqService.publish(
      'identity.events',
      'identity.retailer.document_uploaded',
      {
        retailerId,
        documentType,
        s3Key,
        uploadedAt: new Date().toISOString(),
      },
    );

    this.logger.log(
      `Document uploaded for retailer ${retailerId}: ${documentType}`,
    );
    return updatedRetailer;
  }

  async findByKycStatus(kycStatus: KycStatus): Promise<RetailerDocument[]> {
    return this.retailerModel
      .find({ kycStatus, deletedAt: null })
      .select(
        '-businessRegistrationId -businessRegistrationIdIv -businessRegistrationIdAuthTag',
      )
      .exec();
  }

  async updateKycStatus(
    id: string,
    kycStatus: KycStatus,
  ): Promise<RetailerDocument> {
    const update: Record<string, any> = { kycStatus };

    if (kycStatus === KycStatus.APPROVED) {
      update.status = RetailerStatus.ACTIVE;
    }

    const retailer = await this.retailerModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, update, { new: true })
      .exec();

    if (!retailer) {
      throw new NotFoundException(`Retailer with id ${id} not found`);
    }

    await this.rabbitmqService.publish(
      'identity.events',
      'identity.retailer.kyc_updated',
      {
        retailerId: id,
        kycStatus,
        updatedAt: new Date().toISOString(),
      },
    );

    return retailer;
  }

  private async validateBusinessRegistrationAsync(
    retailerId: string,
    rawRegistrationId: string,
  ): Promise<void> {
    try {
      const result = await this.serproAdapter.validateCnpj(rawRegistrationId);

      await this.retailerModel
        .findByIdAndUpdate(retailerId, {
          taxValidation: {
            isValidated: true,
            isPending: false,
            legalName: result.razaoSocial || null,
            validatedAt: new Date(),
          },
        })
        .exec();

      this.logger.log(`Business registration validated for retailer ${retailerId}`);
    } catch (error) {
      this.logger.warn(
        `Business registration validation failed for retailer ${retailerId}, will retry later: ${(error as Error).message}`,
      );

      await this.retailerModel
        .findByIdAndUpdate(retailerId, {
          'taxValidation.isPending': true,
          'taxValidation.isValidated': false,
        })
        .exec();
    }
  }
}
