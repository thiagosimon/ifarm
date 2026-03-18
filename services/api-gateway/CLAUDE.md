# API Gateway Service

## Overview

NestJS-based API Gateway for the iFarm platform. This is the single entry point for all client requests. Runs on port 3000.

The gateway has no database of its own. It uses Redis for rate limiting, JWT key caching, and session management.

## Architecture

**Request flow:** Client -> Correlation ID -> Rate Limiter -> JWT Auth Guard -> Roles Guard -> Proxy -> Downstream Service

### Routing

All routes are defined in `src/config/routes.config.ts`. The proxy middleware forwards requests to downstream services:

| Path Prefix              | Target Port | Service              |
|--------------------------|-------------|----------------------|
| /api/v1/identity/*       | 3001        | identity-service     |
| /api/v1/auth/*           | 3002        | auth-service         |
| /api/v1/catalog/*        | 3003        | catalog-service      |
| /api/v1/quotes/*         | 3004        | quotation-service    |
| /api/v1/orders/*         | 3006        | order-service        |
| /api/v1/payments/*       | 3007        | payment-service      |
| /api/v1/notifications/*  | 3010        | notification-service |
| /api/v1/reviews/*        | 3011        | review-service       |

### Public Routes (no JWT required)

- POST /api/v1/identity/farmers
- POST /api/v1/identity/retailers
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET /api/v1/catalog/products
- GET /api/v1/catalog/products/:id
- GET /health
- GET /ready

### Rate Limiting

Redis-backed sliding window rate limiter:
- FARMER / RETAILER: 100 req/min by userId
- ADMIN: 1000 req/min by userId
- Auth routes: 10 req/min by IP

Rate limit headers are returned on every response: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.

### Authentication

JWT tokens are validated against Keycloak JWKS endpoint. Signing keys are cached in Redis for 1 hour. On success, the following headers are injected into proxied requests:
- X-User-Id
- X-User-Role
- X-Tenant-Id
- X-Correlation-Id

### Circuit Breaker

Uses opossum with these defaults:
- 50% failure threshold in a 10-second rolling window triggers OPEN state
- 8-second timeout per request
- 30-second wait before transitioning to HALF-OPEN

### Security

- helmet() with CSP, X-Frame-Options: DENY, HSTS (1 year, preload)
- CORS restricted to CORS_ALLOWED_ORIGINS env var
- X-Powered-By header removed

### Observability

- Structured logging via Pino (JSON in production)
- X-Correlation-Id on every request (generated if not present)
- Prometheus metrics at GET /metrics
- Health check at GET /health (liveness)
- Readiness check at GET /ready (checks Redis + downstream TCP connectivity)

## Key Files

- `src/main.ts` - Bootstrap (pino, helmet, CORS)
- `src/app.module.ts` - Root module, middleware registration
- `src/config/routes.config.ts` - Route map, public routes, route matching
- `src/guards/jwt-auth.guard.ts` - JWT validation with JWKS + Redis cache
- `src/guards/roles.guard.ts` - Role-based access control
- `src/middleware/proxy.middleware.ts` - HTTP proxy to downstream services
- `src/middleware/correlation-id.middleware.ts` - Correlation ID generation
- `src/middleware/rate-limiter.service.ts` - Redis sliding window rate limiter
- `src/middleware/rate-limit.middleware.ts` - Rate limit middleware
- `src/circuit-breaker/circuit-breaker.service.ts` - Opossum circuit breaker
- `src/health/health.controller.ts` - Health and readiness endpoints
- `src/metrics/metrics.module.ts` - Prometheus metrics

## Commands

```bash
npm run dev          # Start in watch mode
npm run build        # Compile TypeScript
npm run start:prod   # Run compiled JS
npm test             # Run all tests
npm run test:unit    # Unit tests only
npm run test:cov     # Tests with coverage
npm run lint         # ESLint
npm run type-check   # TypeScript type checking without emitting
npm run clean        # Remove dist/
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `PORT` - Server port (default: 3000)
- `REDIS_URL` - Redis connection string
- `KEYCLOAK_ISSUER_URL` - Keycloak realm URL for JWT issuer validation
- `KEYCLOAK_JWKS_URI` - JWKS endpoint for signing key retrieval
- `CORS_ALLOWED_ORIGINS` - Comma-separated allowed origins
- `NODE_ENV` - Environment (development/production)

## Conventions

- All middleware runs in order: CorrelationId -> RateLimit -> Proxy
- Guards run in order: JwtAuth -> Roles
- Fail-open on Redis errors (rate limiter, JWT cache)
- Downstream service errors return 502 Bad Gateway
- Circuit breaker open returns 503 Service Unavailable
- Use `@Public()` decorator to skip JWT validation on controller routes
- Use `@Roles('ADMIN')` decorator for role-based access on controller routes
