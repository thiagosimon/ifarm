import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export type ProposalDocument = Proposal & Document;

@Schema({ timestamps: true, collection: 'proposals' })
export class Proposal {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  quoteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  retailerId: Types.ObjectId;

  @Prop(
    raw({
      businessName: { type: String, required: true },
      tradeName: { type: String, required: true },
      avgRating: { type: Number, default: 0 },
      stateProvince: { type: String, required: true },
    }),
  )
  retailerSnapshot: {
    businessName: string;
    tradeName: string;
    avgRating: number;
    stateProvince: string;
  };

  @Prop({
    type: [
      raw({
        productId: { type: Types.ObjectId, required: true },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
      }),
    ],
    required: true,
  })
  items: {
    productId: Types.ObjectId;
    unitPrice: number;
    totalPrice: number;
  }[];

  @Prop({ type: Number, required: true, min: 0 })
  subtotalAmount: number;

  @Prop({ type: Number, required: true, min: 0 })
  deliveryFee: number;

  @Prop({ type: Number, required: true, min: 1 })
  deliveryDays: number;

  @Prop(
    raw({
      stateSalesTaxType: { type: String },
      stateSalesTaxRate: { type: Number },
      stateSalesTaxAmount: { type: Number },
      interstateVatDifferential: { type: Number },
      taxSubstitutionAmount: { type: Number },
      legalBasis: { type: String },
      totalWithTax: { type: Number },
    }),
  )
  taxInfo?: {
    stateSalesTaxType: string;
    stateSalesTaxRate: number;
    stateSalesTaxAmount: number;
    interstateVatDifferential: number;
    taxSubstitutionAmount: number;
    legalBasis: string;
    totalWithTax: number;
  } | null;

  @Prop({ type: Number, required: true, min: 0 })
  totalWithTaxAndDelivery: number;

  @Prop({ type: [String], required: true })
  paymentMethods: string[];

  @Prop({ type: String, default: '' })
  observations: string;

  @Prop({
    type: String,
    enum: ProposalStatus,
    default: ProposalStatus.PENDING,
    index: true,
  })
  status: ProposalStatus;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);

ProposalSchema.index({ quoteId: 1, retailerId: 1 }, { unique: true });
