# LGPD Personal Data Mapping

## Overview

This document inventories all personal data processed by the iFarm platform, mapping which microservices hold which categories of personal data, the legal basis for processing under LGPD (Lei Geral de Protecao de Dados, Lei 13.709/2018), retention periods, and data protection measures. This mapping fulfills the requirement of Article 37 of LGPD, which mandates that controllers maintain records of personal data processing activities.

**Data Controller**: iFarm Tecnologia Ltda.
**DPO Contact**: dpo@ifarm.com.br
**Last Updated**: 2026-03-18

---

## Data Subject Categories

| Category | Description | Estimated Volume |
|---|---|---|
| Farmers (Sellers) | Individual farmers or agricultural businesses selling products | 10,000+ |
| Buyers | Individuals or businesses purchasing agricultural products | 5,000+ |
| Logistics Partners | Delivery drivers and logistics company representatives | 500+ |
| Agronomists | Agricultural consultants providing advisory services | 200+ |
| Platform Admins | iFarm internal staff with administrative access | 50+ |

---

## Service-by-Service Data Inventory

### 1. User Service (`services/user-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `fullName` | Identification | All users | Contract execution (Art. 7, V) | Account lifetime + 5 years | Encrypted at rest (database-level) |
| `email` | Contact | All users | Contract execution (Art. 7, V) | Account lifetime + 5 years | Encrypted at rest |
| `phone` | Contact | All users | Contract execution (Art. 7, V) | Account lifetime + 5 years | Encrypted at rest |
| `federalTaxId` (CPF) | Sensitive identification | Individual users | Legal obligation (Art. 7, II) - tax compliance | Account lifetime + 5 years | AES-256-GCM encrypted (RSD-001) |
| `businessRegistrationId` (CNPJ) | Business identification | Business users | Legal obligation (Art. 7, II) - tax compliance | Account lifetime + 5 years | AES-256-GCM encrypted (RSD-001) |
| `stateRegistrationId` | Business identification | Business users | Legal obligation (Art. 7, II) | Account lifetime + 5 years | AES-256-GCM encrypted |
| `address` | Location | All users | Contract execution (Art. 7, V) | Account lifetime + 5 years | Encrypted at rest |
| `dateOfBirth` | Identification | Individual users | Legal obligation (Art. 7, II) - KYC | Account lifetime + 5 years | Encrypted at rest |
| `profilePhoto` | Identification | All users (optional) | Consent (Art. 7, I) | Until withdrawal or account deletion | Object storage with access control |
| `consentHistory` | Consent records | All users | Legal obligation (Art. 7, II) - LGPD Art. 8 | Indefinite (proof of consent) | Immutable append-only log |
| `passwordHash` | Authentication | All users | Contract execution (Art. 7, V) | Account lifetime | bcrypt hashed, never stored in plain text |

**Database**: MongoDB
**Encryption**: Field-level AES-256-GCM for `federalTaxId` and `businessRegistrationId` per RSD-001. Database-level encryption at rest for all other fields.
**Deletion policy**: Soft delete (`deletedAt` timestamp). Hard delete after retention period via scheduled job.

---

### 2. Keycloak Identity Provider (`infra/keycloak`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `username` | Authentication | All users | Contract execution (Art. 7, V) | Account lifetime | Keycloak database encryption |
| `email` | Contact | All users | Contract execution (Art. 7, V) | Account lifetime | Keycloak database encryption |
| `credentials` | Authentication | All users | Contract execution (Art. 7, V) | Account lifetime | bcrypt/PBKDF2 hashed by Keycloak |
| `sessionData` | Authentication | All users | Contract execution (Art. 7, V) | Session duration (max 30 days) | Server-side encrypted sessions |
| `loginHistory` | Security audit | All users | Legitimate interest (Art. 7, IX) - security | 90 days | Keycloak event log, access-controlled |
| `socialLoginTokens` | Authentication | Users with social login | Consent (Art. 7, I) | Session duration | Encrypted, never persisted long-term |
| `federalTaxId` (CPF) | Authentication (custom SPI) | Users with CPF login | Legal obligation (Art. 7, II) | Account lifetime | AES-256-GCM encrypted |

**Database**: Dedicated PostgreSQL instance (separate from application databases)
**Encryption**: Keycloak manages its own encryption. Custom SPI data encrypted at field level.
**Deletion policy**: User deletion in Keycloak cascades to all associated sessions, credentials, and social links.

---

### 3. Payment Service (`services/payment-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `pagarmeRecipientId` | Financial | Farmers (sellers) | Contract execution (Art. 7, V) | Account lifetime + 10 years (tax) | Encrypted at rest |
| `bankAccount.bankCode` | Financial | Farmers (sellers) | Contract execution (Art. 7, V) | Account lifetime + 10 years | Encrypted at rest |
| `bankAccount.agency` | Financial | Farmers (sellers) | Contract execution (Art. 7, V) | Account lifetime + 10 years | Encrypted at rest |
| `bankAccount.accountNumber` | Financial | Farmers (sellers) | Contract execution (Art. 7, V) | Account lifetime + 10 years | AES-256-GCM encrypted |
| `bankAccount.accountDigit` | Financial | Farmers (sellers) | Contract execution (Art. 7, V) | Account lifetime + 10 years | AES-256-GCM encrypted |
| `billingAddress` | Location | Buyers | Contract execution (Art. 7, V) | Order lifetime + 5 years | Encrypted at rest |
| `pagarmeTransactionId` | Financial | Buyers | Contract execution (Art. 7, V) | Order lifetime + 10 years | Database-level encryption |

**Database**: PostgreSQL
**Encryption**: Field-level AES-256-GCM for bank account numbers. Database-level encryption at rest for all columns.
**Deletion policy**: Soft delete only. Financial records retained for 10 years per Brazilian tax legislation (CTN Art. 173-174).
**PCI compliance**: PAN (card number) and CVV are NEVER stored in iFarm systems (RFN-005). Card tokenization is handled entirely by Pagar.me's client-side SDK. Only Pagar.me token references are stored.

---

### 4. Order Service (`services/order-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `buyerName` | Identification | Buyers | Contract execution (Art. 7, V) | Order lifetime + 5 years | Encrypted at rest |
| `buyerFederalTaxId` | Identification | Buyers | Legal obligation (Art. 7, II) - invoicing | Order lifetime + 5 years | AES-256-GCM encrypted |
| `shippingAddress` | Location | Buyers | Contract execution (Art. 7, V) | Order lifetime + 5 years | Encrypted at rest |
| `sellerName` | Identification | Farmers | Contract execution (Art. 7, V) | Order lifetime + 5 years | Encrypted at rest |
| `sellerFederalTaxId` | Identification | Farmers | Legal obligation (Art. 7, II) - invoicing | Order lifetime + 5 years | AES-256-GCM encrypted |

**Database**: PostgreSQL
**Encryption**: Field-level AES-256-GCM for tax IDs. Database-level encryption at rest.
**Deletion policy**: Soft delete. Retained for 5 years per commercial obligation records (Codigo Civil Art. 206).

---

### 5. Quotation Service (`services/quotation-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `requestedBy.name` | Identification | Buyers | Contract execution (Art. 7, V) | Quotation lifetime + 2 years | Encrypted at rest |
| `requestedBy.email` | Contact | Buyers | Contract execution (Art. 7, V) | Quotation lifetime + 2 years | Encrypted at rest |
| `requestedBy.phone` | Contact | Buyers | Contract execution (Art. 7, V) | Quotation lifetime + 2 years | Encrypted at rest |
| `respondedBy.name` | Identification | Farmers | Contract execution (Art. 7, V) | Quotation lifetime + 2 years | Encrypted at rest |
| `respondedBy.federalTaxId` | Identification | Farmers | Legal obligation (Art. 7, II) | Quotation lifetime + 2 years | AES-256-GCM encrypted |

**Database**: MongoDB
**Encryption**: Field-level AES-256-GCM for tax IDs. Database-level encryption at rest via MongoDB Atlas.
**Deletion policy**: Expired quotations are soft-deleted. Hard delete after retention period.

---

### 6. Notification Service (`services/notification-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `recipientEmail` | Contact | All users | Contract execution (Art. 7, V) | 90 days | Encrypted at rest |
| `recipientPhone` | Contact | All users | Contract execution (Art. 7, V) | 90 days | Encrypted at rest |
| `recipientDeviceToken` | Device identifier | Mobile app users | Consent (Art. 7, I) | Until token refresh or app uninstall | Encrypted at rest |
| `notificationContent` | May contain personal data | All users | Contract execution (Art. 7, V) | 90 days | Encrypted at rest |

**Database**: MongoDB
**Encryption**: Database-level encryption at rest.
**Deletion policy**: Notification logs are hard-deleted after 90 days via scheduled BullMQ job. No soft delete needed as notifications are not financial records.

---

### 7. IoT/Telemetry Service (`services/iot-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `farmLocation` (GPS coordinates) | Location | Farmers | Contract execution (Art. 7, V) | Account lifetime | Encrypted at rest |
| `deviceOwnerId` | Identification (indirect) | Farmers | Contract execution (Art. 7, V) | Device lifetime | Encrypted at rest |

**Database**: MongoDB (time-series collections)
**Encryption**: Database-level encryption at rest.
**Deletion policy**: Telemetry data is retained indefinitely for agricultural analytics. Farm location data is deleted when the associated account is deleted.
**Note**: Sensor readings (temperature, humidity, soil moisture) are not personal data and are excluded from this mapping.

---

### 8. Logistics Service (`services/logistics-service`)

| Data Field | Data Category | Data Subjects | Legal Basis | Retention | Protection |
|---|---|---|---|---|---|
| `driverName` | Identification | Logistics partners | Contract execution (Art. 7, V) | Delivery lifetime + 2 years | Encrypted at rest |
| `driverPhone` | Contact | Logistics partners | Contract execution (Art. 7, V) | Delivery lifetime + 2 years | Encrypted at rest |
| `driverFederalTaxId` | Identification | Logistics partners | Legal obligation (Art. 7, II) | Delivery lifetime + 5 years | AES-256-GCM encrypted |
| `deliveryAddress` | Location | Buyers | Contract execution (Art. 7, V) | Delivery lifetime + 2 years | Encrypted at rest |
| `pickupAddress` | Location | Farmers | Contract execution (Art. 7, V) | Delivery lifetime + 2 years | Encrypted at rest |

**Database**: MongoDB
**Encryption**: Field-level AES-256-GCM for tax IDs. Database-level encryption at rest.
**Deletion policy**: Completed delivery records soft-deleted after retention period.

---

## Cross-Cutting Data Processing

### Logging Infrastructure (Grafana Loki)

| Concern | Policy |
|---|---|
| Personal data in logs | Prohibited. All services must use structured logging with PII redaction middleware. `federalTaxId`, `email`, `phone`, and `bankAccount` fields must NEVER appear in log output. |
| Log retention | 30 days in production, 7 days in staging |
| Access control | Log access restricted to on-call engineers and SRE team via Grafana RBAC |

### Monitoring Infrastructure (Prometheus/Grafana)

| Concern | Policy |
|---|---|
| Personal data in metrics | Prohibited. Metric labels must never contain PII. Use anonymized IDs or counters only. |
| Metric retention | 90 days |

### Message Bus (RabbitMQ)

| Concern | Policy |
|---|---|
| Personal data in events | Minimized. Events carry entity IDs, not full PII. Consumers fetch PII from source services when needed. |
| Message persistence | Messages are persistent but transient (consumed and acknowledged within seconds/minutes). DLQ messages may contain PII and are purged after 7 days. |

---

## Data Subject Rights Implementation

### Right to Access (Art. 18, II)

- **Endpoint**: `GET /v1/users/me/data-export`
- **Implementation**: User service aggregates personal data from all services via internal API calls
- **Format**: JSON export containing all personal data held across services
- **SLA**: Response within 15 business days (regulatory maximum)

### Right to Correction (Art. 18, III)

- **Endpoint**: `PATCH /v1/users/me/profile`
- **Implementation**: User service updates profile data and publishes `user.updated` event for downstream services to synchronize
- **Scope**: Name, email, phone, address. Tax IDs require KYC re-verification.

### Right to Deletion (Art. 18, VI)

- **Endpoint**: `POST /v1/users/me/deletion-request`
- **Implementation**: Triggers a BullMQ job that:
  1. Soft-deletes user in User Service
  2. Revokes all Keycloak sessions and disables account
  3. Anonymizes user data in Order Service (replaces PII with "DELETED USER")
  4. Deletes notification logs associated with user
  5. Retains financial records with anonymized PII (legal obligation override per Art. 16, II)
- **Exceptions**: Financial records (orders, payments, commissions) are retained with anonymized PII per legal obligation (Brazilian tax law requires 5-10 year retention)
- **SLA**: Processing within 15 business days

### Right to Data Portability (Art. 18, V)

- **Endpoint**: `GET /v1/users/me/data-export?format=csv`
- **Implementation**: Same as Right to Access but with CSV format option
- **Scope**: All personal data in structured, machine-readable format

### Consent Management (Art. 8)

- **Implementation**: `consentHistory` array in User Service records all consent grants and withdrawals with timestamps (RLGPD-001)
- **Consent types**: Terms of service, privacy policy, marketing communications, data sharing with logistics partners
- **Consent withdrawal**: `POST /v1/users/me/consent` with `{ type, granted: false }`
- **Effect**: Withdrawal of marketing consent stops notification delivery. Withdrawal of core service consent triggers account deactivation flow.

---

## Data Transfer and Third Parties

| Third Party | Data Shared | Purpose | Legal Basis | Data Processing Agreement |
|---|---|---|---|---|
| Pagar.me | `federalTaxId`, `bankAccount`, `billingAddress` | Payment processing | Contract execution (Art. 7, V) | DPA signed |
| MongoDB Atlas (AWS) | All MongoDB-stored data | Database hosting | Contract execution (Art. 7, V) | DPA signed, data region: sa-east-1 |
| AWS (SES) | `email`, notification content | Email delivery | Contract execution (Art. 7, V) | DPA signed, data region: sa-east-1 |
| OneSignal | `deviceToken`, anonymized userId | Push notifications | Consent (Art. 7, I) | DPA signed |
| Meta (WhatsApp Cloud API) | `phone`, message content | WhatsApp notifications | Consent (Art. 7, I) | DPA signed |
| Serpro | `federalTaxId` | CPF/CNPJ validation | Legal obligation (Art. 7, II) | Government API, data minimization applied |

### International Data Transfer

- MongoDB Atlas and AWS SES are configured to use the `sa-east-1` (Sao Paulo) region, keeping personal data within Brazilian borders.
- OneSignal and Meta process data internationally. International transfer is covered by standard contractual clauses per LGPD Art. 33.
- No personal data is transferred to countries without adequate data protection legislation without explicit data subject consent or contractual safeguards.

---

## Data Protection Impact Assessment (DPIA) Triggers

The following processing activities require a DPIA per LGPD Art. 38:

1. **Large-scale processing of sensitive data**: `federalTaxId` (CPF) processing across 10,000+ users
2. **Automated decision-making**: Credit scoring or risk assessment based on transaction history (future feature)
3. **Systematic monitoring**: IoT telemetry data from farm sensors (location tracking)

DPIA documents are maintained separately and reviewed annually by the DPO.

---

## Incident Response

Data breach procedures are documented in `docs/runbooks/lgpd-incident.md`. Key timelines:

- **0-24 hours**: Contain breach, identify affected data, notify DPO
- **24-72 hours**: ANPD notification if required (Art. 48)
- **72+ hours**: Affected user notification if high risk
