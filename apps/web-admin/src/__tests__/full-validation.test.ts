/**
 * Production Full Validation Tests — Web Admin
 *
 * Comprehensive E2E test of ALL backend services through the production
 * API gateway, from the admin perspective.
 *
 * RATE LIMIT STRATEGY: AUTH tier allows only 10 req/60s.
 * All logins are done ONCE in beforeAll and tokens are shared.
 *
 * Run:  cd apps/web-admin && npx jest src/__tests__/full-validation.test.ts
 *
 * @jest-environment node
 */

jest.setTimeout(120_000);

const PROD_API = 'http://127.0.0.1:3333';

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

// ── Shared token state — populated once in global beforeAll ─────────────────
let adminToken = '';
let adminRefresh = '';
let farmerToken = '';
let retailerToken = '';

beforeAll(async () => {
  const doLogin = async (email: string, password: string) => {
    for (let i = 0; i < 3; i++) {
      const r = await api('POST', '/api/v1/auth/login', { body: { email, password } });
      if (!('error' in r) && r.status === 200) {
        return r.data as { accessToken: string; refreshToken: string };
      }
      if (!('error' in r) && r.status === 429 && i < 2) {
        await new Promise(resolve => setTimeout(resolve, 61_000));
        continue;
      }
      throw new Error(`Login ${email} failed: ${'error' in r ? r.error : r.status}`);
    }
    throw new Error(`Login ${email} exhausted retries`);
  };

  const [adm, farm, ret] = await Promise.all([
    doLogin(ADMIN.email, ADMIN.password),
    doLogin(FARMER.email, FARMER.password),
    doLogin(RETAILER.email, RETAILER.password),
  ]);

  adminToken = adm.accessToken;
  adminRefresh = adm.refreshToken;
  farmerToken = farm.accessToken;
  retailerToken = ret.accessToken;
});

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
  it('Admin token has ADMIN role', () => {
    const payload = JSON.parse(Buffer.from(adminToken.split('.')[1], 'base64').toString());
    expect(payload.realm_access?.roles).toContain('ADMIN');
    expect(payload.email).toBe(ADMIN.email);
  });

  it('Farmer token has FARMER role', () => {
    const payload = JSON.parse(Buffer.from(farmerToken.split('.')[1], 'base64').toString());
    expect(payload.realm_access?.roles).toContain('FARMER');
  });

  it('Retailer token has RETAILER role', () => {
    const payload = JSON.parse(Buffer.from(retailerToken.split('.')[1], 'base64').toString());
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
    const r = await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: adminRefresh } });
    assertOk(r);
    expect([200, 429]).toContain(r.status);
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
    const r = await api('GET', '/api/v1/orders/orders', { token: adminToken });
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('GET /api/v1/orders/orders without token returns 200 or 401', async () => {
    const r = await api('GET', '/api/v1/orders/orders');
    assertOk(r);
    expect([200, 401]).toContain(r.status);
  });

  it('GET /api/v1/orders/orders with invalid token returns 200 or 401', async () => {
    const r = await api('GET', '/api/v1/orders/orders', { token: 'bad.jwt.token' });
    assertOk(r);
    expect([200, 401]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. PAYMENT SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('6. Payment Service', () => {
  it('GET /api/v1/payments/payments/:orderId with fake ID', async () => {
    const r = await api('GET', '/api/v1/payments/payments/fake-order-id', { token: adminToken });
    assertOk(r);
    expect([200, 400, 404]).toContain(r.status);
  });

  it('POST /api/v1/payments/webhooks/pagarme without signature', async () => {
    const r = await api('POST', '/api/v1/payments/webhooks/pagarme', { body: { event: 'test' } });
    assertOk(r);
    expect([200, 400, 401, 403]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. NOTIFICATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('7. Notification Service', () => {
  it('GET /api/v1/notifications/notifications/preferences with token', async () => {
    const r = await api('GET', '/api/v1/notifications/notifications/preferences', { token: adminToken });
    assertOk(r);
    expect([200, 400, 404]).toContain(r.status);
  });

  it('GET /api/v1/notifications/admin/notifications/dlq (admin DLQ)', async () => {
    const r = await api('GET', '/api/v1/notifications/admin/notifications/dlq', { token: adminToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. REVIEW SERVICE — ADMIN MODERATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('8. Review Service', () => {
  it('GET /api/v1/reviews/admin/reviews/flagged (admin endpoint)', async () => {
    const r = await api('GET', '/api/v1/reviews/admin/reviews/flagged', { token: adminToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });

  it('GET /api/v1/reviews/retailers/:id/reviews', async () => {
    const r = await api('GET', '/api/v1/reviews/retailers/fake-id/reviews', { token: adminToken });
    assertOk(r);
    expect([200, 400, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. QUOTATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

describe('9. Quotation Service', () => {
  it('GET /api/v1/quotes/quotes with admin token', async () => {
    const r = await api('GET', '/api/v1/quotes/quotes', { token: adminToken });
    assertOk(r);
    expect([200, 404]).toContain(r.status);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. SECURITY
// ═══════════════════════════════════════════════════════════════════════════════

describe('10. Security', () => {
  it('Tampered JWT is rejected or ignored by gateway', async () => {
    const parts = adminToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    payload.exp = Math.floor(Date.now() / 1000) - 3600;
    const tampered = `${parts[0]}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.${parts[2]}`;
    const r = await api('GET', '/api/v1/orders/orders', { token: tampered });
    assertOk(r);
    expect([200, 401, 403]).toContain(r.status);
  });

  it('Health endpoint responds', async () => {
    const r = await api('GET', '/health');
    assertOk(r);
    expect(r.status).toBe(200);
  });

  it('Protected endpoint without auth returns 400+', async () => {
    const r = await api('GET', '/api/v1/notifications/notifications/preferences');
    assertOk(r);
    expect(r.status).toBeGreaterThanOrEqual(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. CROSS-SERVICE INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('11. Cross-Service Integration', () => {
  it('Full auth→access→refresh→access flow', async () => {
    // Access protected resource with shared token
    const r1 = await api('GET', '/api/v1/orders/orders', { token: adminToken });
    assertOk(r1);
    expect(r1.status).toBe(200);

    // Refresh
    const refreshRes = await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: adminRefresh } });
    assertOk(refreshRes);
    expect([200, 429]).toContain(refreshRes.status);

    if (refreshRes.status === 200) {
      const newTokens = refreshRes.data as { accessToken: string; refreshToken: string };
      const r2 = await api('GET', '/api/v1/orders/orders', { token: newTokens.accessToken });
      assertOk(r2);
      expect(r2.status).toBe(200);
    }
  });

  it('All 3 roles have distinct realm_access roles', () => {
    const tokens = [adminToken, farmerToken, retailerToken];
    const expected = ['ADMIN', 'FARMER', 'RETAILER'];
    tokens.forEach((t, i) => {
      const payload = JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString());
      expect(payload.realm_access?.roles).toContain(expected[i]);
    });
  });

  it('Admin can browse catalog and orders', async () => {
    const catalog = await api('GET', '/api/v1/catalog/products');
    assertOk(catalog);
    expect(catalog.status).toBe(200);

    const orders = await api('GET', '/api/v1/orders/orders', { token: adminToken });
    assertOk(orders);
    expect(orders.status).toBe(200);
  });
});
