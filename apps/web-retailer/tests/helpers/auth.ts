/**
 * Auth helpers — sets up mocked session for every protected test.
 *
 * Usage:
 *   import { setupAuth } from '../helpers/auth';
 *   test.beforeEach(async ({ context }) => { await setupAuth(context); });
 */
import { BrowserContext, Page } from '@playwright/test';

export const MOCK_USER = {
  id: 'retailer-001',
  email: 'lojista@ifarm.com.br',
  name: 'Lojista iFarm',
  accessToken: 'mock-access-token',
};

/** Intercepts NextAuth session & CSRF endpoints with mock data */
export async function setupAuth(context: BrowserContext) {
  await context.route('**/api/auth/session', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: MOCK_USER.id, email: MOCK_USER.email, name: MOCK_USER.name },
        accessToken: MOCK_USER.accessToken,
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      }),
    }),
  );

  await context.route('**/api/auth/csrf', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'mock-csrf' }),
    }),
  );

  await context.route('**/api/auth/providers', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        credentials: {
          id: 'credentials',
          name: 'Credentials',
          type: 'credentials',
          signinUrl: '/api/auth/signin/credentials',
          callbackUrl: '/api/auth/callback/credentials',
        },
      }),
    }),
  );
}

/** Navigates to a protected route and verifies the page loaded */
export async function goToProtected(page: Page, path: string) {
  await page.goto(path);
  // If redirected to login, the auth mock is not set correctly
  const url = page.url();
  if (url.includes('/login')) {
    throw new Error(`Not authenticated — redirected to login when accessing ${path}`);
  }
}
