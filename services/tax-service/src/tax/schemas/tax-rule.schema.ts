import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaxRuleDocument = TaxRule & Document;

export enum StateSalesTaxType {
  EXEMPT = 'EXEMPT',
  REDUCED_BASE = 'REDUCED_BASE',
  DEFERRED = 'DEFERRED',
  TAX_SUBSTITUTION = 'TAX_SUBSTITUTION',
  STANDARD = 'STANDARD',
}

@Schema({ _id: false })
export class StateRule {
  @Prop({ required: true })
  stateProvince: string;

  @Prop({ required: true })
  specificRate: number;

  @Prop({ required: true, default: false })
  isExempt: boolean;
}

export const StateRuleSchema = SchemaFactory.createForClass(StateRule);

@Schema({ timestamps: true, collection: 'tax_rules' })
export class TaxRule {
  @Prop({ required: true, index: true })
  tariffCode: string;

  @Prop({ required: true })
  productCategory: string;

  @Prop({
    required: true,
    enum: StateSalesTaxType,
    default: StateSalesTaxType.STANDARD,
  })
  stateSalesTaxType: StateSalesTaxType;

  @Prop({ required: true })
  intrastateTaxRate: number;

  @Prop({ required: true })
  interstateRate7: number;

  @Prop({ required: true })
  interstateRate12: number;

  @Prop({ type: Number, default: null })
  reducedBasePercentage: number | null;

  @Prop({ type: Number, default: null })
  taxSubstitutionMva: number | null;

  @Prop({ required: true })
  legalBasis: string;

  @Prop({ required: true })
  validFrom: Date;

  @Prop({ type: Date, default: null })
  validTo: Date | null;

  @Prop({ type: [StateRuleSchema], default: [] })
  stateRules: StateRule[];
}

export const TaxRuleSchema = SchemaFactory.createForClass(TaxRule);

TaxRuleSchema.index({ tariffCode: 1, validFrom: 1 });
TaxRuleSchema.index({ productCategory: 1 });
