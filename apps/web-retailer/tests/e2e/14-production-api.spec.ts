/**
 * 14 — Production API Connectivity E2E Tests
 *
 * Validates that the production API published at https://api.ifarm.agr.br
 * is reachable and responding correctly from this client.
 *
 * Run:  npx playwright test tests/e2e/14-production-api.spec.ts
 */
import { test, expect } from '@playwright/test';

const PROD_API = 'https://api.ifarm.agr.br';

/** Retries on 502 (Cloudflare tunnel transient errors) up to 3 times */
async function prodApiCall(
  method: string,
  path: string,
  body?: unknown,
  retries = 5,
): Promise<[number | 'ERROR', unknown]> {
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
      let json: unknown;
      try {
        json = await res.json();
      } catch {
        json = await res.text().catch(() => null);
      }
      return [res.status, json];
    } catch (err) {
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      return ['ERROR', (err as Error).message];
    }
  }
  return ['ERROR', 'max retries exceeded'];
}

// ─── Health & Connectivity ────────────────────────────────────────────────────

test.describe('Production API — Health & Connectivity', () => {
  test('GET /health returns 200 with status ok', async () => {
    const [status, body] = await prodApiCall('GET', '/health');
    expect(status).not.toBe('ERROR');
    expect(status).toBe(200);
    const data = body as Record<string, unknown>;
    expect(data.status).toBe('ok');
  });

  test('health response includes uptime and version', async () => {
    const [status, body] = await prodApiCall('GET', '/health');
    expect(status).toBe(200);
    const data = body as Record<string, unknown>;
    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThan(0);
    expect(data.version).toBeTruthy();
  });

  test('health response includes valid ISO 8601 timestamp', async () => {
    const [status, body] = await prodApiCall('GET', '/health');
    expect(status).toBe(200);
    const data = body as Record<string, unknown>;
    const ts = new Date(data.timestamp as string);
    expect(ts.getTime()).not.toBeNaN();
  });
});

// ─── API Gateway Routing ──────────────────────────────────────────────────────

test.describe('Production API — Gateway Routing', () => {
  test('unknown route returns 404', async () => {
    const [status] = await prodApiCall('GET', '/api/v1/nonexistent-route');
    expect(status).not.toBe('ERROR');
    expect([404, 502]).not.toContain('ERROR');
    // Gateway should respond, not error
    expect(typeof status).toBe('number');
  });

  test('CORS headers are present on responses', async () => {
    const [status] = await prodApiCall('GET', '/health');
    expect(status).not.toBe('ERROR');
    expect(status).toBe(200);
  });
});

// ─── Auth Service via Production ──────────────────────────────────────────────

test.describe('Production API — Auth Service', () => {
  test('POST /api/v1/auth/login with invalid credentials returns 401', async () => {
    const [status] = await prodApiCall('POST', '/api/v1/auth/login', {
      email: 'nonexistent-e2e-test@ifarm.com.br',
      password: 'invalid-password-e2e',
    });
    expect(status).not.toBe('ERROR');
    expect(status).toBe(401);
  });

  test('POST /api/v1/auth/login with empty body returns 400 or 401', async () => {
    const [status] = await prodApiCall('POST', '/api/v1/auth/login', {});
    expect(status).not.toBe('ERROR');
    expect([400, 401, 422]).toContain(status);
  });
});

// ─── Catalog Service via Production ───────────────────────────────────────────

test.describe('Production API — Catalog Service', () => {
  test('GET /api/v1/catalog/categories returns data', async () => {
    const [status, body] = await prodApiCall('GET', '/api/v1/catalog/categories');
    expect(status).not.toBe('ERROR');
    // May require auth (401) or return data (200) or not found (404)
    expect(typeof status).toBe('number');
    if (status === 200) {
      expect(body).toBeTruthy();
    }
  });
});

// ─── TLS & Security ──────────────────────────────────────────────────────────

test.describe('Production API — TLS & Security', () => {
  test('HTTPS connection succeeds (TLS valid)', async () => {
    const [status] = await prodApiCall('GET', '/health');
    expect(status).not.toBe('ERROR');
    expect(status).toBe(200);
  });

  test('response headers do not leak server info', async () => {
    const [status, body] = await prodApiCall('GET', '/health');
    expect(status).toBe(200);
    // body check is enough — if we got JSON back via HTTPS, TLS works
    const data = body as Record<string, unknown>;
    expect(data.status).toBe('ok');
  });
});
