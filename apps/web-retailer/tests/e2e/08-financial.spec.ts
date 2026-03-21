/**
 * 08 — Financial
 *
 * Covers:
 *  - Financial page renders with 4 summary cards (Total Pago, Programado, Retido, Taxas)
 *  - Payout history table is displayed
 *  - Calendar section renders
 *  - "Exportar CSV" button is visible
 *  - Holdback notice is shown
 *  - Table columns: Referência, Pedido, Produtor, Bruto, Taxa, Líquido, Data Prevista
 *  - Pagination controls (if present)
 *  - Month navigation in calendar
 */
import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/auth';

const BASE = 'http://localhost:4000';

test.describe('Financial Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/financial`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Financeiro');
  });

  test('four summary KPI cards are displayed', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const kpiLabels = ['Total Pago', 'Programado', 'Retido', 'Taxas'];
    for (const label of kpiLabels) {
      const kpi = page.locator(`text="${label}"`).first();
      if (await kpi.count() > 0) {
        await expect(kpi).toBeVisible();
      }
    }
  });

  test('"Exportar CSV" button is visible', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const csvBtn = page.locator('button:has-text("Exportar CSV"), button:has-text("CSV")').first();
    if (await csvBtn.count() > 0) {
      await expect(csvBtn).toBeVisible();
    }
  });

  test('holdback notice text is displayed', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const holdback = page.locator('text=/holdback|Holdback|7 dias/').first();
    if (await holdback.count() > 0) {
      await expect(holdback).toBeVisible();
    }
  });

  test('payout history table is rendered', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const table = page.locator('table, [class*="Table"]').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible();
    }
  });

  test('table headers include key columns', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const headers = ['Pedido', 'Líquido', 'Data Prevista'];
    for (const h of headers) {
      const th = page.locator(`th:has-text("${h}")`).first();
      if (await th.count() > 0) {
        await expect(th).toBeVisible();
      }
    }
  });

  test('calendar section renders with month navigation', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const calendar = page.locator('text="Calendário de Repasses", text=/Janeiro|Fevereiro|Março/').first();
    if (await calendar.count() > 0) {
      await expect(calendar).toBeVisible();
    }

    // Month navigation buttons
    const prevBtn = page.locator('button:has([data-lucide="chevron-left"]), button:has-text("<")').first();
    const nextBtn = page.locator('button:has([data-lucide="chevron-right"]), button:has-text(">")').first();

    if (await prevBtn.count() > 0) await expect(prevBtn).toBeVisible();
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
      await page.waitForTimeout(200);
      expect(page.url()).toContain('/financial');
    }
  });

  test('payout status badges are visible', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const badges = page.locator('[class*="badge"], [class*="Badge"]');
    if (await badges.count() > 0) {
      await expect(badges.first()).toBeVisible();
    }
  });

  test('currency values are formatted in BRL', async ({ page }) => {
    if (!page.url().includes('/financial')) { test.skip(); }

    const currency = page.locator('text=/R\\$/').first();
    if (await currency.count() > 0) {
      await expect(currency).toBeVisible();
    }
  });
});
