# Commission Service

## Overview
Commission calculation, holdback management, and payout release microservice for iFarm.

## Port
3008

## Database
PostgreSQL

## Key Business Rules

### RFN-001 - Commission Rates
Commission is calculated on the TOTAL order amount (including taxes):
- Less than R$10,000: 5%
- R$10,000 to R$100,000: 3.5%
- Greater than R$100,000: 2%
- Services: 8%

### RFN-002 - Holdback Period
7 business days after delivery, excluding weekends and Brazilian national holidays.
Holidays are hard-coded for 2025 and 2026.

## API Endpoints
- `GET /v1/commissions` - List all commissions (ADMIN)
- `GET /v1/commissions/calculate?totalAmount=&transactionType=` - Calculate commission preview (internal)
- `GET /v1/commissions/export?startDate=&endDate=` - Export CSV (ADMIN)
- `GET /v1/retailers/:id/payouts` - Retailer payouts (RETAILER)
- `GET /v1/retailers/:id/financial-summary` - Financial summary (RETAILER)

## Events Consumed
- `order.delivered` - Creates commission record and schedules holdback release
- `payment.confirmed` - Updates commission with payment reference

## Events Published
- `commission.released` - After holdback period, commission is released

## Dependencies
- PostgreSQL (commissions table)
- RabbitMQ (event bus)
- Redis (BullMQ delayed jobs for holdback release)

## Environment Variables
```
PORT=3008
POSTGRES_URI=postgres://ifarm:ifarm123@localhost:5432/ifarm_commission
RABBITMQ_URL=amqp://ifarm:ifarm123@localhost:5672
REDIS_URL=redis://localhost:6379
```
