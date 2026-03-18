import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DeliveryMode {
  DELIVERY_ADDRESS = 'DELIVERY_ADDRESS',
  DELIVERY_GEOLOCATION = 'DELIVERY_GEOLOCATION',
  STORE_PICKUP = 'STORE_PICKUP',
}

export enum PaymentMethod {
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  CREDIT_CARD = 'CREDIT_CARD',
  RURAL_CREDIT = 'RURAL_CREDIT',
}

export enum QuoteStatus {
  OPEN = 'OPEN',
  IN_PROPOSALS = 'IN_PROPOSALS',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export type QuoteDocument = Quote & Document;

@Schema({ timestamps: true, collection: 'quotes' })
export class Quote {
  @Prop({ type: String, required: true, unique: true, index: true })
  quoteNumber: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  farmerId: Types.ObjectId;

  @Prop(
    raw({
      fullName: { type: String, required: true },
      stateProvince: { type: String, required: true },
      city: { type: String, required: true },
    }),
  )
  farmerSnapshot: {
    fullName: string;
    stateProvince: string;
    city: string;
  };

  @Prop({
    type: [
      raw({
        productId: { type: Types.ObjectId, required: true },
        productSnapshot: raw({
          name: { type: String, required: true },
          category: { type: String, required: true },
          tariffCode: { type: String, required: true },
          measurementUnit: { type: String, required: true },
        }),
        quantity: { type: Number, required: true, min: 0 },
        measurementUnit: { type: String, required: true },
      }),
    ],
    required: true,
    validate: {
      validator: (items: any[]) => items && items.length > 0,
      message: 'At least one item is required',
    },
  })
  items: {
    productId: Types.ObjectId;
    productSnapshot: {
      name: string;
      category: string;
      tariffCode: string;
      measurementUnit: string;
    };
    quantity: number;
    measurementUnit: string;
  }[];

  @Prop({
    type: String,
    enum: DeliveryMode,
    required: true,
  })
  deliveryMode: DeliveryMode;

  @Prop(
    raw({
      city: { type: String },
      stateProvince: { type: String },
      postalCode: { type: String },
      countryCode: { type: String, default: 'BR' },
      location: raw({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] },
      }),
    }),
  )
  deliveryAddress?: {
    city: string;
    stateProvince: string;
    postalCode: string;
    countryCode: string;
    location?: {
      type: string;
      coordinates: number[];
    };
  };

  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
  })
  preferredPaymentMethod: PaymentMethod;

  @Prop({
    type: String,
    enum: QuoteStatus,
    default: QuoteStatus.OPEN,
    index: true,
  })
  status: QuoteStatus;

  @Prop({ type: Number, default: 0 })
  proposalCount: number;

  @Prop(
    raw({
      proposalId: { type: Types.ObjectId },
      retailerName: { type: String },
      totalWithTaxAndDelivery: { type: Number },
    }),
  )
  bestProposal?: {
    proposalId: Types.ObjectId;
    retailerName: string;
    totalWithTaxAndDelivery: number;
  } | null;

  @Prop({ type: Types.ObjectId, default: null })
  selectedProposalId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, default: null, index: true })
  parentQuoteId?: Types.ObjectId | null;

  @Prop({ type: Date, required: true, index: true })
  expiresAt: Date;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);

QuoteSchema.index({ status: 1, expiresAt: 1 });
QuoteSchema.index({ farmerId: 1, status: 1 });
QuoteSchema.index(
  { 'deliveryAddress.location': '2dsphere' },
  { sparse: true },
);
