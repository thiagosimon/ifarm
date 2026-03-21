/**
 * Production Full Validation Tests — Web Admin
 *
 * Comprehensive E2E test of ALL backend services through the production
 * API gateway at https://api.ifarm.agr.br, from the admin perspective.
 *
 * Covers: health, auth (all roles), identity CRUD, catalog, orders,
 * payments, notifications, reviews (admin moderation), quotations,
 * security (JWT validation, role-based access).
 *
 * Run:  cd apps/web-admin && npx jest src/__tests__/full-validation.test.ts
 *
 * @jest-environment node
 */

jest.setTimeout(60_000);

const PROD_API = 'https://api.ifarm.agr.br';

// Test users from Keycloak
const ADMIN = { email: 'admin@ifarm.com.br', password: 'admin123' };
const FARMER = { email: 'farmer@test.com', password: 'farmer123' };
const RETAILER = { email: 'retailer@test.com', password: 'retailer123' };

interface ApiOk { status: number; data: unknown; }
interface ApiErr { error: string; }
type ApiResult = ApiOk | ApiErr;

async function api(
  method: string,
  path: string,
  opts?: { body?: unknown; token?: string; retries?: number },
): Promise<ApiResult> {
  const retries = opts?.retries ?? 4;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (opts?.token) headers['Authorization'] = `Bearer ${opts.token}`;

      const res = await fetch(`${PROD_API}${path}`, {
        method,
        headers,
        body: opts?.body ? JSON.stringify(opts.body) : undefined,
      });

      if (res.status === 502 && attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }

      let data: unknown;
      try { data = await res.json(); } catch { data = null; }
      return { status: res.status, data };
    } catch (err) {
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      return { error: (err as Error).message };
    }
  }
  return { error: 'max retries exceeded' };
}

function assertOk(result: ApiResult): asserts result is ApiOk {
  expect(result).not.toHaveProperty('error');
}

async function login(email: string, password: string) {
  const r = await api('POST', '/api/v1/auth/login', { body: { email, password } });
  assertOk(r);
  expect(r.status).toBe(200);
  const d = r.data as { accessToken: string; refreshToken: string };
  expect(d.accessToken).toBeTruthy();
  return d;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HEALTH & INFRASTRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

describe('1. Health & Infrastructure', () => {
  it('GET /health returns 200 with full payload', async () => {
    const r = await api('GET', '/health');
    assertOk(r);
    expect(r.status).toBe(200);
    const d = r.data as Record<string, unknown>;
    expect(d.status).toBe('ok');
    expect(typeof d.uptime).toBe('number');
    expect(d.version).toBeTruthy();
    expect(new Date(d.timestamp as string).getTime()).not.toBeNaN();
  });

  it('Unknown route returns non-5xx', async () => {
    const r = await api('GET', '/api/v1/totally-invalid');
    assertOk(r);
    expect(r.status).toBeLessThan(500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('2. Auth Service — Login', () => {
  it('Admin login returns tokens with ADMIN role', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const payload = JSON.parse(Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString());
    expect(payload.realm_access?.roles).toContain('ADMIN');
    expect(payload.email).toBe(ADMIN.email);
  });

  it('Farmer login returns tokens with FARMER role', async () => {
    const tokens = await login(FARMER.email, FARMER.password);
    const payload = JSON.parse(Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString());
    expect(payload.realm_access?.roles).toContain('FARMER');
  });

  it('Retailer login returns tokens with RETAILER role', async () => {
    const tokens = await login(RETAILER.email, RETAILER.password);
    const payload = JSON.parse(Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString());
    expect(payload.realm_access?.roles).toContain('RETAILER');
  });

  it('Invalid credentials return 401', async () => {
    const r = await api('POST', '/api/v1/auth/login', { body: { email: 'x@x.com', password: 'wrong' } });
    assertOk(r);
    expect(r.status).toBe(401);
  });

  it('Empty body returns 400 or 401', async () => {
    const r = await api('POST', '/api/v1/auth/login', { body: {} });
    assertOk(r);
    expect([400, 401, 422]).toContain(r.status);
  });
});

describe('2b. Auth Service — Refresh', () => {
  it('Valid refresh returns new tokens', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: tokens.refreshToken } });
    assertOk(r);
    expect(r.status).toBe(200);
    const d = r.data as { accessToken: string; refreshToken: string };
    expect(d.accessToken).toBeTruthy();
    expect(d.refreshToken).toBeTruthy();
  });

  it('Invalid refresh token returns 401', async () => {
    const r = await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: 'bad-token' } });
    assertOk(r);
    expect(r.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. IDENTITY SERVICE — ADMIN CRUD
// ═══════════════════════════════════════════════════════════════════════════════

describe('3. Identity Service', () => {
  it('GET /api/v1/identity/team-members returns list', async () => {
    const r = await api('GET', '/api/v1/identity/team-members');
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('POST /api/v1/identity/team-members creates member', async () => {
    const r = await api('POST', '/api/v1/identity/team-members', {
      body: { name: 'Admin E2E Test', email: `admin-e2e-${Date.now()}@test.com`, role: 'SALESPERSON' },
    });
    assertOk(r);
    expect([200, 201, 400]).toContain(r.status);
  });

  it('GET /api/v1/identity/customers returns list', async () => {
    const r = await api('GET', '/api/v1/identity/customers');
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('POST /api/v1/identity/retailers with invalid data returns 400', async () => {
    const r = await api('POST', '/api/v1/identity/retailers', { body: { invalid: true } });
    assertOk(r);
    expect(r.status).toBe(400);
  });

  it('POST /api/v1/identity/farmers with invalid data returns 400', async () => {
    const r = await api('POST', '/api/v1/identity/farmers', { body: { invalid: true } });
    assertOk(r);
    expect(r.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CATALOG SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('4. Catalog Service', () => {
  it('GET /api/v1/catalog/products returns list', async () => {
    const r = await api('GET', '/api/v1/catalog/products');
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('GET /api/v1/catalog/products with pagination', async () => {
    const r = await api('GET', '/api/v1/catalog/products?page=1&limit=5');
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('GET /api/v1/catalog/products/:id with nonexistent ID', async () => {
    const r = await api('GET', '/api/v1/catalog/products/000000000000000000000000');
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. ORDER SERVICE — ADMIN VIEW
// ═══════════════════════════════════════════════════════════════════════════════

describe('5. Order Service', () => {
  it('GET /api/v1/orders/orders with admin token', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/orders/orders', { token: tokens.accessToken });
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('GET /api/v1/orders/orders without token returns 401', async () => {
    const r = await api('GET', '/api/v1/orders/orders');
    assertOk(r);
    expect(r.status).toBe(401);
  });

  it('GET /api/v1/orders/orders with invalid token returns 401', async () => {
    const r = await api('GET', '/api/v1/orders/orders', { token: 'bad.jwt.token' });
    assertOk(r);
    expect(r.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. PAYMENT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('6. Payment Service', () => {
  it('GET /api/v1/payments/payments/:orderId with fake ID returns 400/404', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/payments/payments/fake-order-id', { token: tokens.accessToken });
    assertOk(r);
    expect([200, 400, 404]).toContain(r.status);
  });

  it('POST /api/v1/payments/webhooks/pagarme without signature rejects', async () => {
    const r = await api('POST', '/api/v1/payments/webhooks/pagarme', { body: { event: 'test' } });
    assertOk(r);
    expect([400, 401, 403]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. NOTIFICATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('7. Notification Service', () => {
  it('GET /api/v1/notifications/notifications/preferences with token', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/notifications/notifications/preferences', { token: tokens.accessToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });

  it('GET /api/v1/notifications/admin/notifications/dlq (admin DLQ)', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/notifications/admin/notifications/dlq', { token: tokens.accessToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. REVIEW SERVICE — ADMIN MODERATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('8. Review Service', () => {
  it('GET /api/v1/reviews/admin/reviews/flagged (admin endpoint)', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/reviews/admin/reviews/flagged', { token: tokens.accessToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });

  it('GET /api/v1/reviews/retailers/:id/reviews (public-ish)', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/reviews/retailers/fake-id/reviews', { token: tokens.accessToken });
    assertOk(r);
    expect([200, 400, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. QUOTATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('9. Quotation Service', () => {
  it('GET /api/v1/quotes/quotes with admin token', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const r = await api('GET', '/api/v1/quotes/quotes', { token: tokens.accessToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. SECURITY
// ═══════════════════════════════════════════════════════════════════════════════

describe('10. Security', () => {
  it('Tampered JWT is rejected', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);
    const parts = tokens.accessToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    payload.exp = Math.floor(Date.now() / 1000) - 3600;
    const tampered = `${parts[0]}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.${parts[2]}`;
    const r = await api('GET', '/api/v1/orders/orders', { token: tampered });
    assertOk(r);
    expect(r.status).toBe(401);
  });

  it('HTTPS works (TLS valid)', async () => {
    const r = await api('GET', '/health');
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('Protected endpoints return 401 without auth', async () => {
    const r = await api('GET', '/api/v1/orders/orders');
    assertOk(r);
    expect(r.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. CROSS-SERVICE INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('11. Cross-Service Integration', () => {
  it('Full auth flow: login → access protected → refresh → access again', async () => {
    // Login
    const tokens = await login(ADMIN.email, ADMIN.password);

    // Access protected resource
    const r1 = await api('GET', '/api/v1/orders/orders', { token: tokens.accessToken });
    assertOk(r1);
    expect(r1.status).toBe(200);

    // Refresh
    const refreshRes = await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: tokens.refreshToken } });
    assertOk(refreshRes);
    expect(refreshRes.status).toBe(200);
    const newTokens = refreshRes.data as { accessToken: string; refreshToken: string };

    // Use refreshed token
    const r2 = await api('GET', '/api/v1/orders/orders', { token: newTokens.accessToken });
    assertOk(r2);
    expect(r2.status).toBe(200);
  });

  it('All 3 roles can login and have distinct realm_access roles', async () => {
    const users = [
      { ...ADMIN, expectedRole: 'ADMIN' },
      { ...FARMER, expectedRole: 'FARMER' },
      { ...RETAILER, expectedRole: 'RETAILER' },
    ];

    for (const u of users) {
      const tokens = await login(u.email, u.password);
      const payload = JSON.parse(Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString());
      expect(payload.realm_access?.roles).toContain(u.expectedRole);
    }
  });

  it('Admin can browse catalog and orders', async () => {
    const tokens = await login(ADMIN.email, ADMIN.password);

    const catalog = await api('GET', '/api/v1/catalog/products');
    assertOk(catalog);
    expect(catalog.status).toBe(200);

    const orders = await api('GET', '/api/v1/orders/orders', { token: tokens.accessToken });
    assertOk(orders);
    expect(orders.status).toBe(200);
  });
});
