# notification-service

Omnichannel notification orchestrator for the iFarm platform.

## Port
3010

## Database
MongoDB (`ifarm_notification`)

## Architecture
- NEVER called via HTTP by other services -- only via RabbitMQ events.
- HTTP endpoints exist ONLY for admin DLQ inspection and user preference management.
- Uses BullMQ (Redis) for reliable delivery with retry (3 attempts: 1min/5min/30min backoff).

## Event-Channel Mapping
| Event                        | Channels            |
|------------------------------|---------------------|
| identity.kyc.approved        | Push + Email        |
| identity.kyc.rejected        | Push + Email        |
| quotation.quote.created      | Push                |
| quotation.proposal.received  | Push                |
| quotation.proposal.accepted  | Push                |
| payment.pix.pending          | Push                |
| payment.confirmed            | Push + WhatsApp     |
| payment.failed               | Push                |
| order.dispatched             | Push                |
| order.delivered              | Push                |
| commission.released          | Push + Email        |
| order.disputed               | Push + Admin alert  |

## Adapters
- **Push**: OneSignal REST API (by external_user_id)
- **WhatsApp**: Meta Cloud API v18.0 (pre-approved templates only)
- **Email**: AWS SES v3 (sa-east-1)

## HTTP Endpoints (admin/user only)
- `GET  /v1/admin/notifications/dlq` -- inspect failed notifications
- `GET  /v1/notifications/preferences` -- get user notification preferences
- `PATCH /v1/notifications/preferences` -- update user notification preferences

## Key Files
- `src/notification/notification.service.ts` -- routing and send logic
- `src/notification/consumers/notification-events.consumer.ts` -- RabbitMQ subscriber
- `src/notification/consumers/notification-send.processor.ts` -- BullMQ worker
- `src/notification/adapters/` -- OneSignal, WhatsApp, SES adapters

## Running
```bash
npm install
npm run start:dev
```

## Environment Variables
See `.env.example`
