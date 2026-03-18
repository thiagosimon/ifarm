import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum FarmerStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  DOCUMENTS_SUBMITTED = 'DOCUMENTS_SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RESUBMISSION_REQUIRED = 'RESUBMISSION_REQUIRED',
}

export enum KycDocumentStatus {
  UPLOADED = 'UPLOADED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export type FarmerDocument = Farmer & Document;

@Schema({ timestamps: true, collection: 'farmers' })
export class Farmer {
  @Prop({ type: String, default: null })
  externalAuthId: string;

  @Prop({ type: String, required: true, trim: true })
  fullName: string;

  @Prop({ type: String, required: true })
  federalTaxId: string;

  @Prop({ type: String, required: true })
  federalTaxIdIv: string;

  @Prop({ type: String, required: true })
  federalTaxIdAuthTag: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: String, default: 'pt-BR' })
  preferredLanguage: string;

  @Prop({ type: String, default: 'BR' })
  countryCode: string;

  @Prop({ type: String, default: null, trim: true })
  farmName: string;

  @Prop(
    raw({
      street: { type: String },
      number: { type: String },
      complement: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      stateProvince: { type: String },
      postalCode: { type: String },
      countryCode: { type: String, default: 'BR' },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    }),
  )
  farmAddress: Record<string, any>;

  @Prop({
    type: String,
    enum: FarmerStatus,
    default: FarmerStatus.PENDING,
    index: true,
  })
  status: FarmerStatus;

  @Prop({
    type: String,
    enum: KycStatus,
    default: KycStatus.NOT_STARTED,
    index: true,
  })
  kycStatus: KycStatus;

  @Prop({
    type: [
      {
        documentType: { type: String, required: true },
        s3Key: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: KycDocumentStatus,
          default: KycDocumentStatus.UPLOADED,
        },
      },
    ],
    default: [],
  })
  kycDocuments: Array<{
    documentType: string;
    s3Key: string;
    uploadedAt: Date;
    status: KycDocumentStatus;
  }>;

  @Prop(
    raw({
      isValidated: { type: Boolean, default: false },
      isPending: { type: Boolean, default: false },
      legalName: { type: String, default: null },
      validatedAt: { type: Date, default: null },
    }),
  )
  taxValidation: Record<string, any>;

  @Prop({
    type: [
      {
        acceptedAt: { type: Date, required: true },
        termsVersion: { type: String, required: true },
        ipAddress: { type: String, required: true },
        deviceId: { type: String, default: null },
      },
    ],
    default: [],
  })
  consentHistory: Array<{
    acceptedAt: Date;
    termsVersion: string;
    ipAddress: string;
    deviceId?: string;
  }>;

  @Prop(
    raw({
      preferredMethod: { type: String, default: 'PIX' },
    }),
  )
  paymentPreferences: Record<string, any>;

  @Prop({ type: Number, default: 1 })
  schemaVersion: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const FarmerSchema = SchemaFactory.createForClass(Farmer);

FarmerSchema.index({ email: 1 }, { unique: true });
FarmerSchema.index({ status: 1, kycStatus: 1 });
FarmerSchema.index({ 'farmAddress.location': '2dsphere' });
FarmerSchema.index({ deletedAt: 1 });
