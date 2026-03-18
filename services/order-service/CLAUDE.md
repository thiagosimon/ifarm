# CLAUDE.md — order-service

## Overview
Order lifecycle state machine for the iFarm platform.
Manages the full order flow from proposal acceptance through delivery or dispute.

## Tech Stack
- **Runtime**: Node.js + NestJS
- **Database**: PostgreSQL via TypeORM
- **Messaging**: RabbitMQ (topic exchange `ifarm.events`)
- **Port**: 3006

## Directory Structure
```
src/
  main.ts                          # Bootstrap, pino logger, validation pipe
  app.module.ts                    # Root module (TypeORM, RabbitMQ, Health, Order)
  order/
    entities/order.entity.ts       # TypeORM entity with JSONB columns
    dto/order.dto.ts               # Validation DTOs
    order.service.ts               # State machine logic, all transitions
    order.controller.ts            # REST endpoints under /v1/orders
    order.module.ts                # Feature module
    consumers/
      order-events.consumer.ts     # RabbitMQ event handlers
  rabbitmq/
    rabbitmq.module.ts             # Global RabbitMQ module
    rabbitmq.service.ts            # Pub/sub with DLQ support
  health/
    health.controller.ts           # GET /health liveness probe
    health.module.ts
```

## State Machine
```
AWAITING_PAYMENT → PAID (payment.confirmed event)
PAID → PREPARING (retailer)
PREPARING → DISPATCHED (retailer + trackingCode)
DISPATCHED → DELIVERED (farmer)
DELIVERED → DISPUTED (farmer, within 7 days)
AWAITING_PAYMENT|PAID → CANCELLED (admin, triggers refund if PAID)
```

## Events Consumed
- `quotation.proposal.accepted` → creates order
- `quotation.auto.accepted` → creates order
- `payment.confirmed` → transitions to PAID
- `payment.failed` → logs failure in timeline

## Events Published
- `order.created` — when order is created from proposal
- `order.paid` — when payment confirmed
- `order.dispatched` — when retailer dispatches
- `order.delivered` — when farmer confirms delivery
- `order.disputed` — when farmer disputes
- `order.cancelled` — when admin cancels

## Key Rules
- All operations are **idempotent** (checked by proposalId for creation, by status for transitions)
- Invalid state transitions return HTTP 422
- Dispute window: 7 days from delivery, reason must be >= 20 chars
- Cancellation of PAID orders triggers refund via payment-service HTTP call
- User identity comes from `x-user-id` and `x-user-role` headers (set by API gateway)

## Running
```bash
cp .env.example .env
npm install
npm run start:dev
```
