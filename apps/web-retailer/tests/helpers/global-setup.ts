/**
 * Global setup: runs once before all tests.
 * Creates auth storage state file used by protected-page tests.
 */
import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const AUTH_FILE = path.join(__dirname, '.auth/session.json');

async function globalSetup(_config: FullConfig) {
  // Ensure .auth directory exists
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // If auth file already exists and is fresh, skip re-auth
  if (fs.existsSync(AUTH_FILE)) {
    const stat = fs.statSync(AUTH_FILE);
    const ageMs = Date.now() - stat.mtimeMs;
    if (ageMs < 4 * 60 * 60 * 1000) {
      console.log('[setup] Reusing existing auth state');
      return;
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Mock the NextAuth session and API calls so tests run without a live backend
  await context.route('**/api/auth/session', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: 'test-user', email: 'lojista@ifarm.com.br', name: 'Lojista iFarm' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      }),
    });
  });

  await context.route('**/api/auth/csrf', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'mock-csrf-token' }),
    });
  });

  await page.goto('http://localhost:4000/dashboard');
  await page.waitForTimeout(1000);

  await context.storageState({ path: AUTH_FILE });
  await browser.close();
  console.log('[setup] Auth state saved to', AUTH_FILE);
}

export default globalSetup;
