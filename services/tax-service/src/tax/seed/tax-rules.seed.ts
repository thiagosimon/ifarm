import { StateSalesTaxType } from '../schemas/tax-rule.schema';

/**
 * Seed data for common agro NCM (tariff) codes.
 * These represent the most common products in Brazilian agricultural commerce.
 */
export const TAX_RULES_SEED = [
  {
    tariffCode: '31052000',
    productCategory: 'Fertilizers - NPK',
    stateSalesTaxType: StateSalesTaxType.EXEMPT,
    intrastateTaxRate: 0,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: null,
    taxSubstitutionMva: null,
    legalBasis: 'Conv. ICMS 100/97 - Isencao para insumos agropecuarios',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 0, isExempt: true },
      { stateProvince: 'MG', specificRate: 0, isExempt: true },
      { stateProvince: 'PR', specificRate: 0, isExempt: true },
      { stateProvince: 'RS', specificRate: 0, isExempt: true },
      { stateProvince: 'GO', specificRate: 0, isExempt: true },
      { stateProvince: 'MT', specificRate: 0, isExempt: true },
      { stateProvince: 'MS', specificRate: 0, isExempt: true },
      { stateProvince: 'BA', specificRate: 0, isExempt: true },
      { stateProvince: 'SC', specificRate: 0, isExempt: true },
    ],
  },
  {
    tariffCode: '38089190',
    productCategory: 'Herbicides - Agrochemicals',
    stateSalesTaxType: StateSalesTaxType.REDUCED_BASE,
    intrastateTaxRate: 18,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: 40,
    taxSubstitutionMva: null,
    legalBasis: 'Conv. ICMS 100/97 - Base de calculo reduzida a 40% para defensivos agricolas',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 18, isExempt: false },
      { stateProvince: 'MG', specificRate: 18, isExempt: false },
      { stateProvince: 'PR', specificRate: 19.5, isExempt: false },
      { stateProvince: 'RS', specificRate: 17, isExempt: false },
      { stateProvince: 'GO', specificRate: 17, isExempt: false },
      { stateProvince: 'MT', specificRate: 17, isExempt: false },
      { stateProvince: 'BA', specificRate: 20.5, isExempt: false },
    ],
  },
  {
    tariffCode: '12011000',
    productCategory: 'Soybeans - Seeds',
    stateSalesTaxType: StateSalesTaxType.EXEMPT,
    intrastateTaxRate: 0,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: null,
    taxSubstitutionMva: null,
    legalBasis: 'Conv. ICMS 16/2015 - Isencao para sementes certificadas',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 0, isExempt: true },
      { stateProvince: 'MG', specificRate: 0, isExempt: true },
      { stateProvince: 'PR', specificRate: 0, isExempt: true },
      { stateProvince: 'RS', specificRate: 0, isExempt: true },
      { stateProvince: 'GO', specificRate: 0, isExempt: true },
      { stateProvince: 'MT', specificRate: 0, isExempt: true },
      { stateProvince: 'MS', specificRate: 0, isExempt: true },
      { stateProvince: 'BA', specificRate: 0, isExempt: true },
    ],
  },
  {
    tariffCode: '87019490',
    productCategory: 'Tractors - Agricultural',
    stateSalesTaxType: StateSalesTaxType.TAX_SUBSTITUTION,
    intrastateTaxRate: 12,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: null,
    taxSubstitutionMva: 35,
    legalBasis: 'Conv. ICMS 52/93 - Substituicao tributaria para maquinas e implementos agricolas',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 12, isExempt: false },
      { stateProvince: 'MG', specificRate: 12, isExempt: false },
      { stateProvince: 'PR', specificRate: 12, isExempt: false },
      { stateProvince: 'RS', specificRate: 12, isExempt: false },
      { stateProvince: 'GO', specificRate: 12, isExempt: false },
      { stateProvince: 'MT', specificRate: 12, isExempt: false },
      { stateProvince: 'SC', specificRate: 12, isExempt: false },
    ],
  },
  {
    tariffCode: '84329000',
    productCategory: 'Farm Implements - Parts',
    stateSalesTaxType: StateSalesTaxType.REDUCED_BASE,
    intrastateTaxRate: 18,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: 51.11,
    taxSubstitutionMva: null,
    legalBasis: 'Conv. ICMS 52/91 - Base reduzida para maquinas e implementos agricolas',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 18, isExempt: false },
      { stateProvince: 'MG', specificRate: 18, isExempt: false },
      { stateProvince: 'PR', specificRate: 19.5, isExempt: false },
      { stateProvince: 'RS', specificRate: 17, isExempt: false },
      { stateProvince: 'GO', specificRate: 17, isExempt: false },
      { stateProvince: 'MT', specificRate: 17, isExempt: false },
    ],
  },
  {
    tariffCode: '30044990',
    productCategory: 'Veterinary Vaccines',
    stateSalesTaxType: StateSalesTaxType.EXEMPT,
    intrastateTaxRate: 0,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: null,
    taxSubstitutionMva: null,
    legalBasis: 'Conv. ICMS 64/97 - Isencao para vacinas, soros e medicamentos veterinarios',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 0, isExempt: true },
      { stateProvince: 'MG', specificRate: 0, isExempt: true },
      { stateProvince: 'PR', specificRate: 0, isExempt: true },
      { stateProvince: 'RS', specificRate: 0, isExempt: true },
      { stateProvince: 'GO', specificRate: 0, isExempt: true },
      { stateProvince: 'MT', specificRate: 0, isExempt: true },
      { stateProvince: 'MS', specificRate: 0, isExempt: true },
      { stateProvince: 'BA', specificRate: 0, isExempt: true },
      { stateProvince: 'SC', specificRate: 0, isExempt: true },
    ],
  },
  {
    tariffCode: '23099090',
    productCategory: 'Animal Feed - Supplements',
    stateSalesTaxType: StateSalesTaxType.REDUCED_BASE,
    intrastateTaxRate: 18,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: 60,
    taxSubstitutionMva: null,
    legalBasis: 'Conv. ICMS 100/97 - Isencao parcial para racoes animais (base reduzida)',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 18, isExempt: false },
      { stateProvince: 'MG', specificRate: 18, isExempt: false },
      { stateProvince: 'PR', specificRate: 19.5, isExempt: false },
      { stateProvince: 'RS', specificRate: 17, isExempt: false },
      { stateProvince: 'GO', specificRate: 17, isExempt: false },
      { stateProvince: 'MT', specificRate: 17, isExempt: false },
      { stateProvince: 'BA', specificRate: 20.5, isExempt: false },
    ],
  },
  {
    tariffCode: '63079090',
    productCategory: 'PPE - Personal Protective Equipment',
    stateSalesTaxType: StateSalesTaxType.STANDARD,
    intrastateTaxRate: 18,
    interstateRate7: 7,
    interstateRate12: 12,
    reducedBasePercentage: null,
    taxSubstitutionMva: null,
    legalBasis: 'Tributacao padrao ICMS - Sem beneficio fiscal especifico para EPIs',
    validFrom: new Date('2024-01-01'),
    validTo: null,
    stateRules: [
      { stateProvince: 'SP', specificRate: 18, isExempt: false },
      { stateProvince: 'RJ', specificRate: 20, isExempt: false },
      { stateProvince: 'MG', specificRate: 18, isExempt: false },
      { stateProvince: 'PR', specificRate: 19.5, isExempt: false },
      { stateProvince: 'RS', specificRate: 17, isExempt: false },
      { stateProvince: 'SC', specificRate: 17, isExempt: false },
      { stateProvince: 'BA', specificRate: 20.5, isExempt: false },
      { stateProvince: 'GO', specificRate: 17, isExempt: false },
      { stateProvince: 'MT', specificRate: 17, isExempt: false },
    ],
  },
];

/**
 * Standalone seed runner.
 * Usage: npx ts-node src/tax/seed/tax-rules.seed.ts
 */
async function runSeed() {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const mongoose = require('mongoose');
  const uri = process.env.MONGODB_URI || 'mongodb://ifarm:ifarm123@localhost:27017/ifarm_tax';

  console.log(`Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);

  const taxRuleSchema = new mongoose.Schema(
    {
      tariffCode: { type: String, required: true, index: true },
      productCategory: String,
      stateSalesTaxType: String,
      intrastateTaxRate: Number,
      interstateRate7: Number,
      interstateRate12: Number,
      reducedBasePercentage: Number,
      taxSubstitutionMva: Number,
      legalBasis: String,
      validFrom: Date,
      validTo: Date,
      stateRules: [
        {
          stateProvince: String,
          specificRate: Number,
          isExempt: Boolean,
        },
      ],
    },
    { timestamps: true, collection: 'tax_rules' },
  );

  const TaxRuleModel = mongoose.model('TaxRule', taxRuleSchema);

  console.log('Clearing existing tax rules...');
  await TaxRuleModel.deleteMany({});

  console.log(`Inserting ${TAX_RULES_SEED.length} tax rules...`);
  await TaxRuleModel.insertMany(TAX_RULES_SEED);

  console.log('Seed completed successfully!');
  console.log('Tax rules inserted:');
  TAX_RULES_SEED.forEach((rule) => {
    console.log(`  - ${rule.tariffCode}: ${rule.productCategory} (${rule.stateSalesTaxType})`);
  });

  await mongoose.disconnect();
  process.exit(0);
}

// Run only when executed directly
if (require.main === module) {
  runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
