import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RetailerProductDocument = RetailerProduct & Document;

@Schema({ timestamps: true, collection: 'retailer_products' })
export class RetailerProduct {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  retailerId: Types.ObjectId;

  @Prop(
    raw({
      name: { type: String, required: true },
      category: { type: String, required: true },
      tariffCode: { type: String, required: true },
      measurementUnit: { type: String, required: true },
    }),
  )
  productSnapshot: {
    name: string;
    category: string;
    tariffCode: string;
    measurementUnit: string;
  };

  @Prop({ type: Number, required: true, min: 0 })
  unitPrice: number;

  @Prop({ type: Number, required: true, min: 0 })
  availableStock: number;

  @Prop({ type: Number, default: 1, min: 1 })
  minimumOrderQuantity: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({
    type: [
      {
        stateProvince: { type: String, required: true },
      },
    ],
    default: [],
  })
  serviceRegions: Array<{
    stateProvince: string;
  }>;

  @Prop({
    type: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String, default: '' },
      },
    ],
    default: [],
  })
  customAttributes: Array<{
    key: string;
    value: string;
    unit: string;
  }>;
}

export const RetailerProductSchema =
  SchemaFactory.createForClass(RetailerProduct);

// Unique compound index: one entry per product per retailer
RetailerProductSchema.index(
  { productId: 1, retailerId: 1 },
  { unique: true },
);

RetailerProductSchema.index({ isActive: 1, availableStock: 1 });
RetailerProductSchema.index({ 'serviceRegions.stateProvince': 1 });
