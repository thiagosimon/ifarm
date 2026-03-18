# Tax Service

## Overview
ICMS, DIFAL, and Tax Substitution calculator microservice for iFarm.
Handles Brazilian agricultural tax calculations based on NCM tariff codes and state rules.

## Port
3009

## Database
MongoDB + Redis (cache)

## API Endpoints
- `POST /v1/tax/calculate` - Calculate taxes for a product transaction

## Tax Calculation Logic

### Input
```json
{
  "tariffCode": "31052000",
  "originStateProvince": "SP",
  "destinationStateProvince": "MG",
  "buyerType": "BUSINESS",
  "subtotalAmount": 50000
}
```

### Processing Steps
1. Find tax rule by `tariffCode` (Redis cache first, 1h TTL)
2. Determine intrastate vs interstate (same state or different)
3. **Intrastate**: Apply state ICMS rate with exemptions/reductions from Conv. ICMS
4. **Interstate to BUSINESS** (contribuinte): Apply interstate rate (7% or 12%), calculate DIFAL
5. **Interstate to INDIVIDUAL** (nao-contribuinte): DIFAL responsibility on seller
6. Check for Tax Substitution (ST) with MVA markup
7. Return full tax breakdown

### Interstate Rate Rules
- Origin in N/NE/CO/ES states: 7%
- Origin in S/SE states: 12%
- S/SE to N/NE/CO/ES: 7%

## Pre-seeded NCM Codes
- `31052000` - NPK fertilizers (EXEMPT - Conv. ICMS 100/97)
- `38089190` - Herbicides (REDUCED_BASE 40% - Conv. ICMS 100/97)
- `12011000` - Soybeans seeds (EXEMPT - Conv. ICMS 16/2015)
- `87019490` - Tractors (TAX_SUBSTITUTION MVA 35% - Conv. ICMS 52/93)
- `84329000` - Farm implements (REDUCED_BASE 51.11%)
- `30044990` - Veterinary vaccines (EXEMPT - Conv. ICMS 64/97)
- `23099090` - Animal feed (REDUCED_BASE 60%)
- `63079090` - PPE (STANDARD rate)

## Environment Variables
```
PORT=3009
MONGODB_URI=mongodb://ifarm:ifarm123@localhost:27017/ifarm_tax
REDIS_URL=redis://localhost:6379
```

## Seeding
```bash
npm run seed
```
