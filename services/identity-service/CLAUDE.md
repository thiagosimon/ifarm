# Identity Service — CLAUDE.md

## Overview
The **identity-service** is a NestJS microservice responsible for farmer and retailer registration, KYC (Know Your Customer) document management, document upload to AWS S3, and CPF/CNPJ validation via Serpro APIs.

- **Port**: 3001
- **Database**: MongoDB (collection prefix: `ifarm_identity`)
- **Exchange**: `identity.events` (RabbitMQ topic exchange)

## Architecture

```
src/
  main.ts                     # Bootstrap (port 3001, validation pipe, pino logger)
  app.module.ts               # Root module importing all feature modules
  crypto/
    crypto.service.ts         # AES-256-GCM encrypt/decrypt for PII fields
    crypto.module.ts          # Global module
  farmer/
    schemas/farmer.schema.ts  # Mongoose schema with encrypted federalTaxId
    dto/create-farmer.dto.ts  # Validation: fullName, email, phoneNumber, federalTaxId, consentHistory
    dto/update-farmer.dto.ts  # Partial update DTO
    farmer.service.ts         # CRUD + LGPD anonymize + data export + document upload
    farmer.controller.ts      # REST endpoints under /v1/farmers
    farmer.module.ts
  retailer/
    schemas/retailer.schema.ts # Mongoose schema with encrypted businessRegistrationId
    dto/create-retailer.dto.ts
    dto/update-retailer.dto.ts
    retailer.service.ts        # CRUD + LGPD anonymize + document upload
    retailer.controller.ts     # REST endpoints under /v1/retailers
    retailer.module.ts
  kyc/
    kyc.service.ts            # KYC queue, approve/reject logic
    kyc.controller.ts         # Admin endpoints under /v1/admin/kyc
    kyc.module.ts
  serpro/
    serpro.adapter.ts         # Serpro CPF/CNPJ validation via OAuth2, Redis cached
    serpro.module.ts          # Global module
  storage/
    storage.service.ts        # S3 upload with magic-byte MIME validation, SSE-S3, presigned URLs
    storage.module.ts         # Global module
  rabbitmq/
    rabbitmq.service.ts       # Publish events to identity.events exchange (topic)
    rabbitmq.module.ts        # Global module
  health/
    health.controller.ts      # GET /health (liveness), GET /health/ready (readiness)
    health.module.ts
```

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/farmers | Register a new farmer (public) |
| GET | /v1/farmers/:id | Get farmer by ID |
| PATCH | /v1/farmers/:id | Partial update farmer |
| POST | /v1/farmers/:id/documents | Upload KYC document (multipart) |
| GET | /v1/farmers/:id/documents/:docIndex | Get presigned URL for document |
| DELETE | /v1/farmers/me?userId=X | LGPD anonymize (right to be forgotten) |
| GET | /v1/farmers/me/export?userId=X | LGPD data portability export |
| POST | /v1/retailers | Register a new retailer (public) |
| GET | /v1/retailers/:id | Get retailer by ID |
| PATCH | /v1/retailers/:id | Partial update retailer |
| POST | /v1/retailers/:id/documents | Upload KYC document (multipart) |
| GET | /v1/admin/kyc/queue?status=X | List KYC review queue |
| PATCH | /v1/admin/kyc/:ownerId/approve | Approve KYC |
| PATCH | /v1/admin/kyc/:ownerId/reject | Reject KYC (requires reason) |
| GET | /health | Liveness probe |
| GET | /health/ready | Readiness probe (MongoDB + RabbitMQ) |

## Critical Rules
- **RSD-001**: `federalTaxId` and `businessRegistrationId` are encrypted with AES-256-GCM at rest. CryptoService NEVER exposes decrypt via HTTP.
- **RLGPD-001**: `consentHistory` with at least 1 item is REQUIRED on registration.
- **LGPD Anonymize**: Sets personal fields to null/anonymized, keeps financial data. Does NOT hard-delete.
- **Serpro validation**: Non-blocking. If Serpro fails, `taxValidation.isPending = true`. Registration is NOT blocked.
- **S3 uploads**: Magic-byte MIME validation (not file extension). Max 10MB. SSE-S3 encryption. Presigned URLs expire in 15 minutes.
- **RabbitMQ events**: All state changes publish to `identity.events` topic exchange.

## Commands
```bash
npm run build        # Compile TypeScript
npm run start:dev    # Development with watch mode
npm run test         # Run unit tests
npm run test:cov     # Run tests with coverage
npm run type-check   # TypeScript type checking only
```

## Environment Variables
See `.env.example` for all required configuration. Key variables:
- `MONGODB_URI` - MongoDB connection string
- `ENCRYPTION_KEY` - 32-byte base64-encoded AES key
- `RABBITMQ_URI` - RabbitMQ connection string
- `AWS_S3_BUCKET` - S3 bucket for documents
- `SERPRO_CLIENT_ID` / `SERPRO_CLIENT_SECRET` - Serpro OAuth2 credentials
- `REDIS_HOST` / `REDIS_PORT` - Redis for Serpro token and result caching
