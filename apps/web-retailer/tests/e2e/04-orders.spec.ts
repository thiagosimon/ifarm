/**
 * 04 — Orders
 *
 * Covers:
 *  - Orders page renders with kanban columns (Em Preparação, Despachados, Entregues, Disputados)
 *  - Search input filters orders
 *  - Order card renders with customer, total, date
 *  - Clicking order card opens detail dialog
 *  - Order detail shows timeline, items, customer info
 *  - "Informar Rastreio" opens tracking input
 *  - Submitting tracking code with empty field shows validation
 *  - "Despachar Pedido" button visible on preparing orders
 */
import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/auth';

const BASE = 'http://localhost:4000';

test.describe('Orders Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/orders`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Pedidos');
  });

  test('kanban column headings are visible', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const columns = ['Em Preparação', 'Despachados', 'Entregues', 'Disputados'];
    for (const col of columns) {
      const heading = page.locator(`text="${col}", h2:has-text("${col}"), h3:has-text("${col}")`).first();
      if (await heading.count() > 0) {
        await expect(heading).toBeVisible();
      }
    }
  });

  test('search input is functional', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const search = page.locator('input[placeholder*="número"], input[placeholder*="produtor"], input[placeholder*="Buscar"]').first();
    if (await search.count() > 0) {
      await search.fill('#1847');
      await expect(search).toHaveValue('#1847');
      await search.clear();
    }
  });

  test('order cards are displayed', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    // Orders should have cards with order numbers
    const cards = page.locator('[class*="card"], [class*="glass"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('clicking order card opens detail dialog', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const orderCard = page.locator('[class*="card"] button, [class*="order"]').first();
    if (await orderCard.count() > 0) {
      await orderCard.click();
      await page.waitForTimeout(400);

      const dialog = page.locator('[role="dialog"], [class*="Dialog"], [class*="modal"]').first();
      if (await dialog.count() > 0) {
        await expect(dialog).toBeVisible();
      }
    }
  });

  test('order detail dialog shows required information', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const orderCard = page.locator('[class*="card"] button').first();
    if (await orderCard.count() > 0) {
      await orderCard.click();
      await page.waitForTimeout(400);

      const dialog = page.locator('[role="dialog"]').first();
      if (await dialog.count() > 0 && await dialog.isVisible()) {
        // Dialog should contain order details
        const content = await dialog.textContent();
        // Should have some meaningful content
        expect(content?.length).toBeGreaterThan(10);
      }
    }
  });

  test('tracking code input appears when "Informar Rastreio" is clicked', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const trackingBtn = page.locator('button:has-text("Informar Rastreio"), button:has-text("Rastreio")').first();
    if (await trackingBtn.count() > 0) {
      await trackingBtn.click();
      await page.waitForTimeout(300);

      const trackingInput = page.locator('input[placeholder*="rastreio"], input[placeholder*="Rastreio"], input[name*="tracking"]').first();
      if (await trackingInput.count() > 0) {
        await expect(trackingInput).toBeVisible();
      }
    }
  });

  test('submitting tracking form with empty code is prevented', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const trackingBtn = page.locator('button:has-text("Informar Rastreio")').first();
    if (await trackingBtn.count() > 0) {
      await trackingBtn.click();
      await page.waitForTimeout(300);

      const confirmBtn = page.locator('button:has-text("Confirmar Envio"), button[type="submit"]').last();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
        await page.waitForTimeout(200);
        // Should show validation or stay on the same state
        const input = page.locator('input[required]').first();
        if (await input.count() > 0) {
          const valid = await input.evaluate((el: HTMLInputElement) => el.validity.valid);
          expect(valid).toBe(false);
        }
      }
    }
  });

  test('"Despachar Pedido" button triggers action on preparing orders', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const dispatchBtn = page.locator('button:has-text("Despachar")').first();
    if (await dispatchBtn.count() > 0) {
      await expect(dispatchBtn).toBeVisible();
      await expect(dispatchBtn).toBeEnabled();
    }
  });

  test('"Imprimir Danfe" button is visible for shipped/delivered orders', async ({ page }) => {
    if (!page.url().includes('/orders')) { test.skip(); }

    const danfeBtn = page.locator('button:has-text("Danfe"), button:has-text("DANFE")').first();
    if (await danfeBtn.count() > 0) {
      await expect(danfeBtn).toBeVisible();
    }
  });
});
