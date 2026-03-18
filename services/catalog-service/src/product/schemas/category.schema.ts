import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ type: Types.ObjectId, default: null, index: true })
  parentId: Types.ObjectId | null;

  @Prop({ type: String, required: true, index: true })
  path: string;

  @Prop({ type: Number, required: true, min: 0 })
  level: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({ type: String, default: '' })
  icon: string;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ path: 1, isActive: 1 });
CategorySchema.index({ parentId: 1, sortOrder: 1 });
