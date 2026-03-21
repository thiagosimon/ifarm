import { defineConfig, devices } from '@playwright/test';

/**
 * iFarm Web-Retailer — Playwright E2E Configuration
 * App runs on port 4000, API Gateway on port 3100.
 *
 * Run all tests:         npx playwright test
 * Run specific suite:   npx playwright test tests/e2e/01-auth.spec.ts
 * UI mode (debug):      npx playwright test --ui
 * Report:               npx playwright show-report
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,          // keep sequential so auth state flows correctly
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  use: {
    baseURL: 'http://localhost:4000',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 8_000,
    navigationTimeout: 15_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'pt-BR',
  },

  globalSetup: './tests/helpers/global-setup.ts',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Uncomment to start Next.js dev server automatically */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:4000',
  //   reuseExistingServer: true,
  //   timeout: 120_000,
  // },
});
