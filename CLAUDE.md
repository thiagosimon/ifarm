# iFarm Platform — Contexto para Agentes Claude Code
## Identidade
Plataforma: iFarm | Ecossistema Digital do Agronegócio Brasileiro
Stack: Node.js 20 + NestJS 10 + Flutter 3.x + React 18 + Next.js 14 + MongoDB 7 + PostgreSQL 16 + Redis 7
Infra: Docker + Kubernetes + GitHub Actions + Grafana + Prometheus + Loki
Integrações: Pagar.me v5 + Keycloak 24 + RabbitMQ 3.13 + OneSignal + Meta Cloud API + AWS SES + Serpro

## Arquitetura
- Monorepo com Turborepo + npm workspaces
- 17 microservices NestJS com TypeScript
- 5 frontends (Flutter mobile + 4 Next.js web apps)
- Event-driven via RabbitMQ (topic exchanges, DLQ)
- MongoDB para domínios não-financeiros, PostgreSQL para financeiros
- Redis para cache, rate limiting, BullMQ jobs

## Convenções
- Nomenclatura de campos em INGLÊS universal (federalTaxId, não cpf)
- IDs MongoDB: ObjectId nativo. IDs PostgreSQL: UUID v4
- Versionamento de API: /v1/ prefix
- Paginação: ?page=1&limit=20 (max 100)
- Timestamps: ISO 8601 UTC
- Erros: { statusCode, message, error, details:[{field,error}] }
- Soft delete para dados financeiros/KYC

## Regras Críticas
- RFN-001: Comissão sobre valor TOTAL da NF (com impostos)
- RFN-002: Holdback 7 dias ÚTEIS (excluir feriados BR)
- RFN-003: Split no Pagar.me ANTES da cobrança
- RFN-004: Idempotência em webhooks (pagarmeTransactionId UNIQUE)
- RFN-005: NUNCA armazenar PAN/CVV
- RCQ-001: tariffCode (NCM) obrigatório em cada item
- RCQ-002: Aceite atômico via findOneAndUpdate
- RSD-001: federalTaxId/businessRegistrationId AES-256-GCM encrypted
- RLGPD-001: consentHistory obrigatório no cadastro

## Comandos
npm run build → build all
npm run test → test all
docker compose up -d → infra local
