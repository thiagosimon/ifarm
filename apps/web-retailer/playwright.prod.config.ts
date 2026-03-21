import { defineConfig } from '@playwright/test';

/**
 * Minimal Playwright config for production API connectivity tests.
 * No browser launch, no globalSetup — pure HTTP/fetch API tests.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '14-production-api.spec.ts',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  reporter: [['list']],
  use: { headless: true },
  projects: [{ name: 'production-api', testMatch: '14-production-api.spec.ts' }],
});
