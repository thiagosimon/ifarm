# Matching Service

## Overview
Eligibility engine that, given a quoteId, finds eligible retailers. Consumes quotation events from RabbitMQ, runs a MongoDB aggregation pipeline on `retailer_products`, and publishes matched retailer IDs for the notification service.

## Port
3005

## Tech
- MongoDB (raw aggregation via Mongoose connection) for eligibility queries
- Redis for caching matching results (5min TTL per quoteId + productId)
- RabbitMQ for consuming quote events and publishing matching results

## Matching Pipeline
Given a quote, the aggregation pipeline on `retailer_products`:
1. `$match`: productId in quote items, isActive=true, availableStock > 0
2. `$lookup`: join `retailers` collection, filter status=ACTIVE, kycStatus=APPROVED
3. `$match`: serviceRegions covers farmer's stateProvince
4. `$match`: accepts preferred payment method (if specified)
5. `$sort`: avgRating desc, totalSales desc
6. `$limit`: 20 (MAX_RETAILERS_PER_QUOTE)

## RabbitMQ Events

### Consumed
- `quotation.quote.created` - Triggers matching for new quotes
- `quotation.recurring.triggered` - Triggers matching for recurring quotes

### Published
- `matching.retailers_found` - List of eligible retailerIds for a quote
- `matching.no_retailers_found` - When 0 eligible retailers, notifies farmer

## API Endpoints
- `GET /v1/matching/quote/:quoteId` - Internal/debug endpoint to view matching results

## Commands
```bash
npm run build
npm run start:dev
npm test
```
