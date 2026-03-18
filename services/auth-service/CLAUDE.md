# Auth Service

## Overview
NestJS microservice handling authentication via Keycloak integration. Runs on port 3002.

## Key Commands
- `npm run start:dev` - Start in development mode with hot-reload
- `npm run build` - Compile TypeScript to dist/
- `npm run start:prod` - Start production build
- `npm test` - Run unit tests
- `npm run lint` - Lint and auto-fix

## Architecture
- **Keycloak Adapter** (`src/auth/keycloak.adapter.ts`): HTTP client wrapping Keycloak REST API for token operations and user management.
- **Auth Service** (`src/auth/auth.service.ts`): Business logic delegating to Keycloak adapter.
- **Auth Controller** (`src/auth/auth.controller.ts`): REST endpoints under `/v1/auth/`.
- **Auth Events Consumer** (`src/auth/consumers/auth-events.consumer.ts`): Listens for `identity.farmer.registered` and `identity.retailer.registered` RabbitMQ events to auto-provision Keycloak users.
- **RabbitMQ Module** (`src/rabbitmq/`): Shared RabbitMQ connection and channel management.
- **Health Module** (`src/health/`): Liveness/readiness probes at `/health`.

## Environment Variables
Copy `.env.example` to `.env` and adjust values. Required:
- `KEYCLOAK_BASE_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`
- `REDIS_URL`
- `RABBITMQ_URL`

## API Endpoints
| Method | Path              | Description            |
|--------|-------------------|------------------------|
| POST   | /v1/auth/login    | Authenticate user      |
| POST   | /v1/auth/refresh  | Refresh access token   |
| POST   | /v1/auth/logout   | Revoke refresh token   |
| GET    | /v1/auth/me       | Get current user info  |
| GET    | /health           | Health check           |
