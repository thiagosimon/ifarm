# quotation-service — CLAUDE.md

## Identity
CORE microservice of the iFarm platform. Manages the entire quote lifecycle:
farmer creates quote request, retailers submit proposals, farmer compares and
accepts a proposal. Also handles recurring quote configurations and automatic
acceptance.

## Tech Stack
- NestJS 10 + TypeScript 5
- MongoDB 7 (Mongoose 8) — collections: quotes, proposals, recurring_configs
- BullMQ 5 + Redis 7 — background jobs (expiration, recurring creation)
- RabbitMQ 3.13 — event publishing (topic exchange `ifarm.events`)
- Prometheus metrics via @willsoto/nestjs-prometheus
- Pino structured logging

## Port
3004

## API Endpoints (all prefixed with /v1)
| Method | Path | Actor | Description |
|--------|------|-------|-------------|
| POST | /v1/quotes | FARMER | Create quote request |
| GET | /v1/quotes?farmerId=&page=&limit= | FARMER | List own quotes (paginated) |
| GET | /v1/quotes/:id | ANY | Get quote + proposals |
| GET | /v1/quotes/:id/compare | FARMER | Comparison table (sorted by price) |
| POST | /v1/quotes/:id/proposals | RETAILER | Submit proposal |
| POST | /v1/quotes/:id/proposals/:pid/accept | FARMER | Accept proposal |
| POST | /v1/quotes/recurring | FARMER | Create recurring config |
| GET | /v1/quotes/recurring?farmerId= | FARMER | List recurring configs |
| PATCH | /v1/quotes/recurring/:id?farmerId= | FARMER | Update recurring config |
| GET | /health | INFRA | Health check (Mongo + RabbitMQ) |
| GET | /health/live | INFRA | Liveness probe |
| GET | /health/ready | INFRA | Readiness probe |
| GET | /metrics | INFRA | Prometheus metrics |

## Business Rules
- **RCQ-001**: tariffCode (NCM 8 digits) is mandatory on every item. Validated
  both in DTO (class-validator) and service layer.
- **RCQ-002**: Proposal acceptance is ATOMIC via `findOneAndUpdate` with
  preconditions `status IN [OPEN, IN_PROPOSALS]` AND `selectedProposalId IS NULL`.
  If returns null -> 409 Conflict.
- **RCQ-003**: Proposals can only be submitted for quotes in OPEN or IN_PROPOSALS
  status. One proposal per retailer per quote (unique compound index, 409 if dup).
- **RCQ-004**: Auto-accept for recurring quotes: if `autoAccept=true` and
  `totalWithTaxAndDelivery <= maxAcceptPrice`, the proposal is automatically
  accepted. Event: `quotation.auto.accepted`.
- **RCQ-005**: Expiration processor runs every 15 min (BullMQ CRON). Quotes
  with status OPEN/IN_PROPOSALS and expiresAt <= now are set to EXPIRED.

## Events Published (RabbitMQ)
| Routing Key | When |
|-------------|------|
| quotation.quote.created | New quote created (manual or recurring) |
| quotation.proposal.received | Retailer submits proposal |
| quotation.proposal.accepted | Farmer accepts proposal |
| quotation.auto.accepted | Auto-accept triggered by recurring config |
| quotation.quote.expired | Quote expired by cron job |

## External Dependencies
- **tax-service** (port 3009): Called during proposal creation at
  `POST /v1/tax/calculate` with 3s timeout. On failure, proposal is saved
  without taxInfo (graceful fallback).

## Key Files
```
src/
  main.ts                          — Bootstrap, pino logging, ValidationPipe
  app.module.ts                    — Root module
  quote/
    schemas/quote.schema.ts        — Quote Mongoose schema & enums
    schemas/proposal.schema.ts     — Proposal Mongoose schema & enums
    schemas/recurring-config.schema.ts — Recurring config schema
    dto/create-quote.dto.ts        — Quote creation validation
    dto/create-proposal.dto.ts     — Proposal creation validation
    dto/create-recurring.dto.ts    — Recurring config creation/update validation
    quote.service.ts               — Quote CRUD, compare table (aggregation)
    proposal.service.ts            — Proposal creation, acceptance, auto-accept
    recurring.service.ts           — Recurring config CRUD, nextFireAt calculation
    quote.controller.ts            — All REST endpoints
    quote.module.ts                — Feature module
  jobs/
    expiration.processor.ts        — BullMQ: expire stale quotes every 15 min
    recurring.processor.ts         — BullMQ: create recurring quotes every hour
  rabbitmq/
    rabbitmq.service.ts            — AMQP connection + publish helper
    rabbitmq.module.ts             — Global RabbitMQ module
  health/
    health.controller.ts           — /health, /health/live, /health/ready
    health.module.ts               — Terminus health module
  metrics/
    metrics.module.ts              — Prometheus metrics module
```

## Commands
```bash
npm run build          # Compile TypeScript
npm run start:dev      # Watch mode
npm run test           # Unit tests
npm run test:cov       # Coverage report
npm run start:prod     # Production (node dist/main)
```

## Environment Variables
See `.env.example`. Key vars:
- `PORT` (3004)
- `MONGO_URI`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `RABBITMQ_URI`
- `TAX_SERVICE_URL` (http://localhost:3009)
- `QUOTE_EXPIRATION_HOURS` (default 24)
