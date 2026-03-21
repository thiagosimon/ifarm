import { defineConfig } from '@playwright/test';

/**
 * Minimal Playwright config for production API connectivity tests.
 * No browser launch, no globalSetup — pure HTTP/fetch API tests.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /1[45]-.*\.spec\.ts/,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [['list']],
  use: { headless: true },
  projects: [
    { name: 'production-api', testMatch: '14-production-api.spec.ts' },
    { name: 'full-validation', testMatch: '15-full-validation.spec.ts' },
  ],
});
