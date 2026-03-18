# CLAUDE.md — payment-service

## Overview
Payment processing service for the iFarm platform.
Integrates with Pagar.me v5 for PIX, boleto, and credit card payments.
Handles webhooks, split payments, and refunds.

## Tech Stack
- **Runtime**: Node.js + NestJS
- **Database**: PostgreSQL via TypeORM
- **Messaging**: RabbitMQ (topic exchange `ifarm.events`)
- **Payment Gateway**: Pagar.me v5 (Basic Auth)
- **Port**: 3007

## Directory Structure
```
src/
  main.ts                                   # Bootstrap, pino logger, validation pipe
  app.module.ts                             # Root module (TypeORM, RabbitMQ, Health, Payment)
  payment/
    entities/transaction.entity.ts          # TypeORM entity for transactions
    pagarme.adapter.ts                      # HTTP client for Pagar.me v5 API with retry
    payment.service.ts                      # Charge creation, webhook processing, refund
    payment.controller.ts                   # REST endpoints
    payment.module.ts                       # Feature module
    consumers/
      payment-events.consumer.ts            # RabbitMQ event handlers
  rabbitmq/
    rabbitmq.module.ts                      # Global RabbitMQ module
    rabbitmq.service.ts                     # Pub/sub with DLQ support
  health/
    health.controller.ts                    # GET /health liveness probe
    health.module.ts
```

## Key Business Rules
- **RFN-003**: Split rules are configured BEFORE the charge is created
- **RFN-004**: Webhook processing is idempotent by pagarmeTransactionId
- **RFN-005**: Card PAN/CVV are NEVER stored. Only card token, last four digits, and brand
- **RFN-006**: Refund is triggered by order-service for cancellations
- **RSD-004**: Webhook signature validated with HMAC SHA256

## Payment Methods
- **PIX**: QR code generated, expires in 7200s (2 hours)
- **Boleto**: URL + barcode, expires in 3 business days
- **Credit Card**: Uses tokenized card (card_token), never raw PAN/CVV

## Pagar.me Adapter
- HTTP client with Basic Auth
- axios-retry: 3 attempts with backoff 1s/3s/10s
- Only retries on 5xx errors and network errors
- Endpoint: POST /core/v5/orders

## Events Consumed
- `order.created` -> creates a charge in Pagar.me

## Events Published
- `payment.pix.pending` — PIX QR code generated
- `payment.boleto.created` — Boleto URL generated
- `payment.confirmed` — Payment confirmed (webhook or instant card approval)
- `payment.failed` — Payment failed (webhook)
- `payment.refunded` — Payment refunded

## Endpoints
- `POST /v1/webhooks/pagarme` — Public webhook (HMAC validated, always returns 200)
- `GET /v1/payments/:orderId` — Get transaction by order ID
- `POST /v1/payments/:orderId/refund` — Trigger refund (called by order-service)

## Running
```bash
cp .env.example .env
npm install
npm run start:dev
```
