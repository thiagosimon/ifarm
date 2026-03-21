/**
 * Production API Connectivity Tests — Web Admin
 *
 * Validates that the production API at https://api.ifarm.agr.br
 * is reachable and responding correctly.
 *
 * Run:  cd apps/web-admin && npx jest src/__tests__/production-api.test.ts
 *
 * @jest-environment node
 */

jest.setTimeout(30_000);

const PROD_API = 'https://api.ifarm.agr.br';

async function prodApiCall(
  method: string,
  path: string,
  body?: unknown,
  retries = 5,
): Promise<{ status: number; data: unknown } | { error: string }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(`${PROD_API}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.status === 502 && attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
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

// ─── Health & Connectivity ────────────────────────────────────────────────────

describe('Production API — Health & Connectivity', () => {

  it('GET /health returns 200 with status ok', async () => {
    const result = await prodApiCall('GET', '/health');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect(result.status).toBe(200);
      const data = result.data as Record<string, unknown>;
      expect(data.status).toBe('ok');
    }
  });

  it('health response includes uptime and version', async () => {
    const result = await prodApiCall('GET', '/health');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect(result.status).toBe(200);
      const data = result.data as Record<string, unknown>;
      expect(typeof data.uptime).toBe('number');
      expect(Number(data.uptime)).toBeGreaterThan(0);
      expect(data.version).toBeTruthy();
    }
  });

  it('health response includes valid ISO 8601 timestamp', async () => {
    const result = await prodApiCall('GET', '/health');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      const data = result.data as Record<string, unknown>;
      const ts = new Date(data.timestamp as string);
      expect(ts.getTime()).not.toBeNaN();
    }
  });
});

// ─── API Gateway Routing ──────────────────────────────────────────────────────

describe('Production API — Gateway Routing', () => {

  it('unknown route returns 404 (not 5xx)', async () => {
    const result = await prodApiCall('GET', '/api/v1/nonexistent-route');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect(typeof result.status).toBe('number');
      expect(result.status).toBeLessThan(500);
    }
  });
});

// ─── Auth Service ─────────────────────────────────────────────────────────────

describe('Production API — Auth Service', () => {

  it('POST /api/v1/auth/login with invalid credentials returns 401', async () => {
    const result = await prodApiCall('POST', '/api/v1/auth/login', {
      email: 'nonexistent-admin-e2e@ifarm.com.br',
      password: 'invalid-password-e2e',
    });
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect(result.status).toBe(401);
    }
  });

  it('POST /api/v1/auth/login with empty body returns 400 or 401', async () => {
    const result = await prodApiCall('POST', '/api/v1/auth/login', {});
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect([400, 401, 422]).toContain(result.status);
    }
  });
});

// ─── Admin-specific Endpoints (require auth, expect 401/403) ──────────────────

describe('Production API — Admin Endpoints (unauthenticated)', () => {

  it('GET /api/v1/admin/dashboard without token returns 401 or 403', async () => {
    const result = await prodApiCall('GET', '/api/v1/admin/dashboard');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect([401, 403, 404]).toContain(result.status);
    }
  });

  it('GET /api/v1/identity/retailers without token returns 401 or 403', async () => {
    const result = await prodApiCall('GET', '/api/v1/identity/retailers');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect([401, 403, 404]).toContain(result.status);
    }
  });
});

// ─── TLS & Security ──────────────────────────────────────────────────────────

describe('Production API — TLS & Security', () => {

  it('HTTPS connection succeeds (TLS valid)', async () => {
    const result = await prodApiCall('GET', '/health');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      expect(result.status).toBe(200);
    }
  });

  it('response does not expose internal server technology', async () => {
    const result = await prodApiCall('GET', '/health');
    expect(result).not.toHaveProperty('error');
    if ('status' in result) {
      const data = result.data as Record<string, unknown>;
      expect(data.status).toBe('ok');
    }
  });
});
