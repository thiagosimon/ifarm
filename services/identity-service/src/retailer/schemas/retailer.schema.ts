import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RetailerStatus {
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

export type RetailerDocument = Retailer & Document;

@Schema({ timestamps: true, collection: 'retailers' })
export class Retailer {
  @Prop({ type: String, default: null })
  externalAuthId: string;

  @Prop({ type: String, required: true, trim: true })
  businessName: string;

  @Prop({ type: String, default: null, trim: true })
  tradeName: string;

  @Prop({ type: String, required: true })
  businessRegistrationId: string;

  @Prop({ type: String, required: true })
  businessRegistrationIdIv: string;

  @Prop({ type: String, required: true })
  businessRegistrationIdAuthTag: string;

  @Prop(
    raw({
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      role: { type: String, default: 'owner' },
    }),
  )
  responsiblePerson: Record<string, any>;

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
  address: Record<string, any>;

  @Prop({ type: [String], default: [] })
  serviceRegions: string[];

  @Prop(
    raw({
      bankCode: { type: String },
      branchNumber: { type: String },
      accountNumber: { type: String },
      pagarmeRecipientId: { type: String, default: null },
    }),
  )
  paymentAccount: Record<string, any>;

  @Prop({
    type: String,
    enum: RetailerStatus,
    default: RetailerStatus.PENDING,
    index: true,
  })
  status: RetailerStatus;

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

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  avgRating: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalReviews: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalSales: number;

  @Prop({ type: Number, default: 1 })
  schemaVersion: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const RetailerSchema = SchemaFactory.createForClass(Retailer);

RetailerSchema.index({ email: 1 }, { unique: true });
RetailerSchema.index({ status: 1, kycStatus: 1 });
RetailerSchema.index({ 'address.location': '2dsphere' });
RetailerSchema.index({ serviceRegions: 1 });
RetailerSchema.index({ deletedAt: 1 });
