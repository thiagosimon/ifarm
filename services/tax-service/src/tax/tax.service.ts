import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Redis from 'ioredis';
import { TaxRule, TaxRuleDocument, StateSalesTaxType } from './schemas/tax-rule.schema';
import { CalculateTaxDto, BuyerType, TaxCalculationResult } from './dto/calculate-tax.dto';

/**
 * States in the North (N), Northeast (NE), Center-West (CO), and Espirito Santo (ES)
 * regions use the 7% interstate rate. South (S) and Southeast (SE) use 12%.
 */
const STATES_7_PERCENT = new Set([
  // Norte
  'AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO',
  // Nordeste
  'AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE',
  // Centro-Oeste
  'DF', 'GO', 'MT', 'MS',
  // Espirito Santo
  'ES',
]);

const STATES_12_PERCENT = new Set([
  // Sul
  'PR', 'RS', 'SC',
  // Sudeste (exceto ES)
  'MG', 'RJ', 'SP',
]);

/** Standard intrastate ICMS rates by state (default is 18%) */
const STATE_ICMS_RATES: Record<string, number> = {
  SP: 0.18,
  RJ: 0.20,
  MG: 0.18,
  PR: 0.195,
  RS: 0.17,
  SC: 0.17,
  BA: 0.205,
  GO: 0.17,
  MT: 0.17,
  MS: 0.17,
  ES: 0.17,
  PE: 0.18,
  CE: 0.20,
  PA: 0.19,
  AM: 0.20,
  MA: 0.22,
  PI: 0.21,
  RN: 0.18,
  PB: 0.20,
  AL: 0.19,
  SE: 0.19,
  TO: 0.20,
  RO: 0.175,
  AC: 0.19,
  AP: 0.18,
  RR: 0.20,
  DF: 0.20,
};

const REDIS_CACHE_TTL = 3600; // 1 hour in seconds

@Injectable()
export class TaxService {
  private readonly logger = new Logger(TaxService.name);
  private readonly redis: Redis;

  constructor(
    @InjectModel(TaxRule.name)
    private readonly taxRuleModel: Model<TaxRuleDocument>,
  ) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis cache');
    });

    this.redis.on('error', (err) => {
      this.logger.error(`Redis error: ${err.message}`);
    });
  }

  /**
   * POST /v1/tax/calculate
   *
   * Full ICMS/DIFAL/ST calculation logic:
   * 1. Find tax rule by tariffCode (check Redis cache first)
   * 2. Determine intrastate vs interstate
   * 3. For intrastate: apply state rate with exemptions/reductions
   * 4. For interstate to BUSINESS (contribuinte): apply interstate rate, calculate DIFAL
   * 5. For interstate to INDIVIDUAL (nao-contribuinte): DIFAL on seller
   * 6. Check for tax substitution (ST) by state
   * 7. Return full breakdown
   */
  async calculateTax(dto: CalculateTaxDto): Promise<TaxCalculationResult> {
    const { tariffCode, originStateProvince, destinationStateProvince, buyerType, subtotalAmount } = dto;

    // 1. Find tax rule (cache-first)
    const taxRule = await this.findTaxRule(tariffCode);

    if (!taxRule) {
      this.logger.warn(`Tax rule not found for tariff code: ${tariffCode}`);
      return {
        stateSalesTaxType: 'UNKNOWN',
        stateSalesTaxRate: 0,
        stateSalesTaxAmount: 0,
        interstateVatDifferential: 0,
        taxSubstitutionAmount: 0,
        legalBasis: '',
        totalWithTax: subtotalAmount,
        calculatedAt: new Date().toISOString(),
      };
    }

    const origin = originStateProvince.toUpperCase();
    const destination = destinationStateProvince.toUpperCase();
    const isIntrastate = origin === destination;

    let stateSalesTaxRate = 0;
    let stateSalesTaxAmount = 0;
    let interstateVatDifferential = 0;
    let taxSubstitutionAmount = 0;
    let effectiveType = taxRule.stateSalesTaxType;

    // Check for state-specific rules
    const stateRule = taxRule.stateRules.find(
      (r) => r.stateProvince === destination,
    );

    // 2 & 3. Intrastate transaction
    if (isIntrastate) {
      const result = this.calculateIntrastateTax(
        taxRule,
        stateRule,
        destination,
        subtotalAmount,
      );
      stateSalesTaxRate = result.rate;
      stateSalesTaxAmount = result.amount;
      effectiveType = result.effectiveType;
    } else {
      // 4 & 5. Interstate transaction
      const interstateRate = this.getInterstateRate(origin, destination);

      if (buyerType === BuyerType.BUSINESS) {
        // Interstate to contribuinte: apply interstate rate, calculate DIFAL
        stateSalesTaxRate = interstateRate;
        stateSalesTaxAmount = parseFloat((subtotalAmount * interstateRate).toFixed(2));

        // DIFAL = (destination intrastate rate - interstate rate) * base
        const destinationRate = this.getDestinationInternalRate(taxRule, stateRule, destination);
        const difal = destinationRate - interstateRate;
        if (difal > 0) {
          interstateVatDifferential = parseFloat((subtotalAmount * difal).toFixed(2));
        }
      } else {
        // Interstate to nao-contribuinte: DIFAL responsibility on seller
        const destinationRate = this.getDestinationInternalRate(taxRule, stateRule, destination);
        stateSalesTaxRate = interstateRate;
        stateSalesTaxAmount = parseFloat((subtotalAmount * interstateRate).toFixed(2));

        const difal = destinationRate - interstateRate;
        if (difal > 0) {
          // For non-taxpayer (INDIVIDUAL), seller pays the full DIFAL
          interstateVatDifferential = parseFloat((subtotalAmount * difal).toFixed(2));
        }
      }
    }

    // 6. Check for Tax Substitution (ST)
    if (taxRule.stateSalesTaxType === StateSalesTaxType.TAX_SUBSTITUTION && taxRule.taxSubstitutionMva !== null) {
      const mva = taxRule.taxSubstitutionMva / 100;
      const stBase = subtotalAmount * (1 + mva);
      const destinationRate = this.getDestinationInternalRate(taxRule, stateRule, destination);
      const stAmount = stBase * destinationRate - stateSalesTaxAmount;
      taxSubstitutionAmount = parseFloat(Math.max(stAmount, 0).toFixed(2));
      effectiveType = StateSalesTaxType.TAX_SUBSTITUTION;
    }

    const totalWithTax = parseFloat(
      (subtotalAmount + stateSalesTaxAmount + interstateVatDifferential + taxSubstitutionAmount).toFixed(2),
    );

    return {
      stateSalesTaxType: effectiveType,
      stateSalesTaxRate: parseFloat((stateSalesTaxRate * 100).toFixed(2)),
      stateSalesTaxAmount,
      interstateVatDifferential,
      taxSubstitutionAmount,
      legalBasis: taxRule.legalBasis,
      totalWithTax,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate intrastate tax considering exemptions and reductions.
   */
  private calculateIntrastateTax(
    taxRule: TaxRule,
    stateRule: { stateProvince: string; specificRate: number; isExempt: boolean } | undefined,
    destination: string,
    subtotalAmount: number,
  ): { rate: number; amount: number; effectiveType: StateSalesTaxType } {
    // If state-specific rule marks exempt
    if (stateRule?.isExempt) {
      return { rate: 0, amount: 0, effectiveType: StateSalesTaxType.EXEMPT };
    }

    // If the tax rule type is EXEMPT
    if (taxRule.stateSalesTaxType === StateSalesTaxType.EXEMPT) {
      return { rate: 0, amount: 0, effectiveType: StateSalesTaxType.EXEMPT };
    }

    // Use state-specific rate if available, otherwise the standard intrastate rate
    let baseRate = stateRule?.specificRate
      ? stateRule.specificRate / 100
      : taxRule.intrastateTaxRate / 100;

    // If no specific rate and no rule intrastate rate, fall back to state default
    if (baseRate === 0 && taxRule.stateSalesTaxType === StateSalesTaxType.STANDARD) {
      baseRate = STATE_ICMS_RATES[destination] || 0.18;
    }

    // Apply reduced base if applicable
    if (
      taxRule.stateSalesTaxType === StateSalesTaxType.REDUCED_BASE &&
      taxRule.reducedBasePercentage !== null
    ) {
      const reducedBase = subtotalAmount * (taxRule.reducedBasePercentage / 100);
      const amount = parseFloat((reducedBase * baseRate).toFixed(2));
      const effectiveRate = amount / subtotalAmount;
      return {
        rate: effectiveRate,
        amount,
        effectiveType: StateSalesTaxType.REDUCED_BASE,
      };
    }

    // Standard or deferred calculation
    const amount = parseFloat((subtotalAmount * baseRate).toFixed(2));
    return {
      rate: baseRate,
      amount,
      effectiveType: taxRule.stateSalesTaxType,
    };
  }

  /**
   * Get interstate rate based on origin state.
   * N/NE/CO/ES -> 7%, S/SE -> 12%.
   */
  private getInterstateRate(origin: string, destination: string): number {
    // If origin is in N/NE/CO/ES group, use 7%
    if (STATES_7_PERCENT.has(origin)) {
      return 0.07;
    }
    // If origin is in S/SE group, use 12%
    if (STATES_12_PERCENT.has(origin)) {
      // Exception: exports from S/SE to N/NE/CO/ES also use 7%
      if (STATES_7_PERCENT.has(destination)) {
        return 0.07;
      }
      return 0.12;
    }
    // Default fallback
    return 0.12;
  }

  /**
   * Get the destination state's internal ICMS rate, considering tax rule overrides.
   */
  private getDestinationInternalRate(
    taxRule: TaxRule,
    stateRule: { stateProvince: string; specificRate: number; isExempt: boolean } | undefined,
    destination: string,
  ): number {
    if (stateRule?.isExempt) return 0;
    if (stateRule?.specificRate) return stateRule.specificRate / 100;
    if (taxRule.intrastateTaxRate) return taxRule.intrastateTaxRate / 100;
    return STATE_ICMS_RATES[destination] || 0.18;
  }

  /**
   * Find a tax rule by tariff code, checking Redis cache first.
   * Cache TTL: 1 hour.
   */
  private async findTaxRule(tariffCode: string): Promise<TaxRule | null> {
    const cacheKey = `tax_rule:${tariffCode}`;

    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for tariff code: ${tariffCode}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      this.logger.warn(`Redis cache read error: ${(error as Error).message}`);
    }

    const now = new Date();
    const taxRule = await this.taxRuleModel
      .findOne({
        tariffCode,
        validFrom: { $lte: now },
        $or: [{ validTo: null }, { validTo: { $gte: now } }],
      })
      .lean()
      .exec();

    if (!taxRule) {
      return null;
    }

    try {
      await this.redis.set(cacheKey, JSON.stringify(taxRule), 'EX', REDIS_CACHE_TTL);
      this.logger.debug(`Cached tax rule for tariff code: ${tariffCode}`);
    } catch (error) {
      this.logger.warn(`Redis cache write error: ${(error as Error).message}`);
    }

    return taxRule as TaxRule;
  }
}
