# review-service

Reviews of retailers by farmers after delivery.

## Port
3011

## Database
MongoDB (`ifarm_review`)

## Architecture
- Farmers can leave reviews for retailers ONLY after an order is delivered.
- Review eligibility is created automatically when `order.delivered` event is consumed.
- Eligibility expires 30 days after delivery.
- Comments are checked against a profanity blocklist; flagged reviews are hidden until moderated.
- Retailer average rating is recalculated on every review creation and moderation.

## Schemas
- **Review**: orderId (unique), farmerId, retailerId, overallRating (1-5), deliveryRating, productQualityRating, communicationRating, comment, isModerationFlagged, isPublished
- **ReviewEligibility**: orderId (unique), farmerId, retailerId, isEligible, expiresAt (30 days), reviewedAt

## HTTP Endpoints
- `POST   /v1/reviews` -- create review (FARMER, x-user-id header)
- `GET    /v1/retailers/:id/reviews` -- get retailer reviews (public, paginated)
- `GET    /v1/admin/reviews/flagged` -- get flagged reviews (ADMIN)
- `PATCH  /v1/admin/reviews/:id/moderate` -- approve/reject review (ADMIN)

## Events Consumed
- `order.delivered` -- creates ReviewEligibility record and schedules 30-day expiration

## Events Published
- `review.created`
- `review.moderated`
- `review.rating.recalculated`

## Key Files
- `src/review/review.service.ts` -- core business logic
- `src/review/consumers/review-events.consumer.ts` -- RabbitMQ consumer
- `src/review/helpers/blocklist.ts` -- profanity blocklist

## Running
```bash
npm install
npm run start:dev
```

## Environment Variables
See `.env.example`
