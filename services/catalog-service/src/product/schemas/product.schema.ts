import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProductCategory {
  FERTILIZERS = 'FERTILIZERS',
  PESTICIDES = 'PESTICIDES',
  SEEDS = 'SEEDS',
  ANIMAL_FEED = 'ANIMAL_FEED',
  VETERINARY = 'VETERINARY',
  MACHINERY = 'MACHINERY',
  IRRIGATION = 'IRRIGATION',
  TOOLS = 'TOOLS',
  SOIL_AMENDMENTS = 'SOIL_AMENDMENTS',
  BIOLOGICAL_CONTROL = 'BIOLOGICAL_CONTROL',
  FUEL_LUBRICANTS = 'FUEL_LUBRICANTS',
  PACKAGING = 'PACKAGING',
  OTHER = 'OTHER',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, default: '', trim: true })
  description: string;

  @Prop({ type: String, default: '', trim: true })
  brand: string;

  @Prop({
    type: String,
    enum: ProductCategory,
    required: true,
    index: true,
  })
  category: ProductCategory;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{8}$/.test(v),
      message: 'tariffCode must be exactly 8 digits (RCQ-001)',
    },
  })
  tariffCode: string;

  @Prop({
    type: String,
    default: null,
    validate: {
      validator: (v: string | null) => v === null || /^\d{7}$/.test(v),
      message: 'cestCode must be exactly 7 digits',
    },
  })
  cestCode: string | null;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{4}$/.test(v),
      message: 'cfopCode must be exactly 4 digits',
    },
  })
  cfopCode: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[0-8]$/.test(v),
      message: 'originCode must be a single digit 0-8',
    },
  })
  originCode: string;

  @Prop({ type: Boolean, required: true, default: false })
  isRuralCreditEligible: boolean;

  @Prop({ type: String, required: true, trim: true })
  measurementUnit: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: [
      {
        url: { type: String, required: true },
        s3Key: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  images: Array<{
    url: string;
    s3Key: string;
    isPrimary: boolean;
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
  attributes: Array<{
    key: string;
    value: string;
    unit: string;
  }>;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
    index: true,
  })
  status: ProductStatus;

  @Prop({ type: String, required: true, index: true })
  createdBy: string;

  @Prop({ type: Number, default: 1 })
  schemaVersion: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Text index with weights for full-text search
ProductSchema.index(
  {
    name: 'text',
    description: 'text',
    brand: 'text',
    tags: 'text',
  },
  {
    weights: {
      name: 10,
      description: 5,
      brand: 3,
      tags: 2,
    },
    name: 'product_text_search',
    default_language: 'portuguese',
  },
);

ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ isRuralCreditEligible: 1 });
