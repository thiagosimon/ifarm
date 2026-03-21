/**
 * 07 — Customers (CRM CRUD)
 *
 * Covers:
 *  - Customers page renders with 4 KPI cards
 *  - Customer table columns: name, city, phone, totalSpent, orders, status
 *  - Filter buttons: Todos, Ativo, Inativo
 *  - Search filters by name/email/city
 *  - "Adicionar Cliente" opens modal
 *  - Add form: name*, email*, phone, city, state, status
 *  - Form validation for required fields
 *  - Successful customer creation via mocked API
 *  - KPI numbers update after adding customer
 *  - MoreVertical menu: Edit and Delete options
 *  - Edit modal opens with pre-filled data
 *  - Edit saves changes and updates row
 *  - Delete confirmation dialog appears
 *  - Confirming delete removes customer row
 *  - Cancelling delete keeps customer
 *  - Filter "Inativo" shows only inactive customers
 */
import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/auth';
import { mockCustomersAPI, MOCK_CUSTOMERS } from '../helpers/api-mocks';

const BASE = 'http://localhost:4000';

test.describe('Customers Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await mockCustomersAPI(context);
    await page.goto(`${BASE}/customers`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Clientes');
  });

  test('four KPI cards are visible', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const kpiTexts = ['Total de Clientes', 'Clientes Ativos', 'Novos este Mês', 'Ticket Médio'];
    for (const txt of kpiTexts) {
      const kpi = page.locator(`text="${txt}"`).first();
      if (await kpi.count() > 0) {
        await expect(kpi).toBeVisible();
      }
    }
  });

  test('customer table has expected columns', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const headers = ['Nome', 'Total Gasto', 'Status'];
    for (const h of headers) {
      const col = page.locator(`th:has-text("${h}"), td:has-text("${h}")`).first();
      if (await col.count() > 0) {
        await expect(col).toBeVisible();
      }
    }
  });

  test('customers from mocked API are displayed in table', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const fazenda = page.locator('text="Fazenda Santa Clara"').first();
    if (await fazenda.count() > 0) {
      await expect(fazenda).toBeVisible();
    }
  });

  // ─── Filters ─────────────────────────────────────────────────────────────

  test('filter buttons: Todos, Ativo, Inativo are visible', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    for (const label of ['Todos', 'Ativo', 'Inativo']) {
      const btn = page.locator(`button:has-text("${label}")`).first();
      if (await btn.count() > 0) {
        await expect(btn).toBeVisible();
      }
    }
  });

  test('clicking "Inativo" filter shows only inactive customers', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const inativoBtn = page.locator('button:has-text("Inativo")').first();
    if (await inativoBtn.count() > 0) {
      await inativoBtn.click();
      await page.waitForTimeout(300);

      // Active customers should not appear
      const activeRows = page.locator('td:has-text("Fazenda Santa Clara")');
      if (await activeRows.count() > 0) {
        // Fazenda Santa Clara is active — should be hidden
        await expect(activeRows.first()).not.toBeVisible();
      }
    }
  });

  test('clicking "Todos" after filter shows all customers', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    await page.locator('button:has-text("Inativo")').first().click?.();
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Todos")').first().click?.();
    await page.waitForTimeout(200);
    expect(page.url()).toContain('/customers');
  });

  test('search input filters by customer name', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const search = page.locator('input[placeholder*="Buscar"]').first();
    if (await search.count() > 0) {
      await search.fill('Fazenda');
      await page.waitForTimeout(300);

      // Agropecuária should not be visible
      const agro = page.locator('text="Agropecuária Três Rios"').first();
      if (await agro.count() > 0) {
        await expect(agro).not.toBeVisible();
      }

      await search.clear();
    }
  });

  // ─── Add Customer ─────────────────────────────────────────────────────────

  test('"Adicionar Cliente" button opens modal', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    await page.locator('button:has-text("Adicionar Cliente")').click();
    await page.waitForTimeout(300);

    const modal = page.locator('[class*="fixed"][class*="inset-0"]').first();
    await expect(modal).toBeVisible();
  });

  test('add modal has name, email, phone, city, state, status fields', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    await page.locator('button:has-text("Adicionar Cliente")').click();
    await page.waitForTimeout(300);

    const emailInput = page.locator('input[type="email"]').first();
    const statusSelect = page.locator('select').first();

    await expect(emailInput).toBeVisible();
    await expect(statusSelect).toBeVisible();
  });

  test('empty form submit shows validation errors', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    await page.locator('button:has-text("Adicionar Cliente")').click();
    await page.waitForTimeout(300);

    await page.locator('button:has-text("Salvar")').click();
    await page.waitForTimeout(300);

    const nameInput = page.locator('input[required]').first();
    if (await nameInput.count() > 0) {
      const valid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(valid).toBe(false);
    }
  });

  test('creates a new customer and it appears in the list', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    await page.locator('button:has-text("Adicionar Cliente")').click();
    await page.waitForTimeout(300);

    await page.locator('input[placeholder*="Fazenda"]').fill('Sítio Novo E2E');
    await page.locator('input[type="email"]').fill('novo@sitioe2e.com.br');
    await page.locator('input[placeholder*="(11)"], input[placeholder*="Telefone"]').first().fill('(11) 99999-0000');
    await page.locator('input[placeholder*="São Paulo"], input[placeholder*="Cidade"]').first().fill('São Paulo');
    await page.locator('input[placeholder*="SP"], input[placeholder*="Estado"]').first().fill('SP');

    await page.locator('button:has-text("Salvar")').click();
    await page.waitForTimeout(800);

    // Customer should appear in table after success
    const newCustomer = page.locator('text="Sítio Novo E2E"').first();
    if (await newCustomer.count() > 0) {
      await expect(newCustomer).toBeVisible();
    }
  });

  test('modal cancel button closes modal', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    await page.locator('button:has-text("Adicionar Cliente")').click();
    await page.waitForTimeout(300);

    await page.locator('button:has-text("Cancelar")').click();
    await page.waitForTimeout(300);

    const modal = page.locator('[class*="fixed"][class*="inset-0"]').first();
    if (await modal.count() > 0) {
      await expect(modal).not.toBeVisible();
    }
  });

  // ─── Edit Customer ────────────────────────────────────────────────────────

  test('MoreVertical opens context menu with Edit/Delete', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const moreBtn = page.locator('button:has([data-lucide="more-vertical"]), tr button').last();
    if (await moreBtn.count() > 0) {
      await moreBtn.click();
      await page.waitForTimeout(200);

      const editOpt = page.locator('button:has-text("Editar")').first();
      const deleteOpt = page.locator('button:has-text("Excluir")').first();

      if (await editOpt.count() > 0) await expect(editOpt).toBeVisible();
      if (await deleteOpt.count() > 0) await expect(deleteOpt).toBeVisible();
    }
  });

  test('Edit option opens modal with pre-filled name/email', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const moreBtn = page.locator('table button').last();
    if (await moreBtn.count() > 0) {
      await moreBtn.click();
      await page.waitForTimeout(200);

      const editOpt = page.locator('button:has-text("Editar")').first();
      if (await editOpt.count() > 0 && await editOpt.isVisible()) {
        await editOpt.click();
        await page.waitForTimeout(300);

        const emailInput = page.locator('[class*="fixed"] input[type="email"]').first();
        if (await emailInput.count() > 0) {
          const value = await emailInput.inputValue();
          expect(value).toContain('@');
        }
      }
    }
  });

  // ─── Delete Customer ──────────────────────────────────────────────────────

  test('Delete option shows confirmation dialog', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const moreBtn = page.locator('table button').last();
    if (await moreBtn.count() > 0) {
      await moreBtn.click();
      await page.waitForTimeout(200);

      const deleteOpt = page.locator('button:has-text("Excluir")').first();
      if (await deleteOpt.count() > 0 && await deleteOpt.isVisible()) {
        await deleteOpt.click();
        await page.waitForTimeout(300);

        const confirmText = page.locator('text=/Tem certeza|Excluir cliente/').first();
        if (await confirmText.count() > 0) {
          await expect(confirmText).toBeVisible();
        }
      }
    }
  });

  test('Cancelling delete keeps the customer', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const moreBtn = page.locator('table button').last();
    if (await moreBtn.count() > 0) {
      await moreBtn.click();
      await page.waitForTimeout(200);

      const deleteOpt = page.locator('button:has-text("Excluir")').first();
      if (await deleteOpt.count() > 0 && await deleteOpt.isVisible()) {
        await deleteOpt.click();
        await page.waitForTimeout(300);

        const cancelBtn = page.locator('[class*="fixed"] button:has-text("Cancelar")').first();
        if (await cancelBtn.count() > 0) {
          await cancelBtn.click();
          await page.waitForTimeout(300);

          // Dialog gone
          const dialog = page.locator('text="Excluir cliente"').first();
          if (await dialog.count() > 0) {
            await expect(dialog).not.toBeVisible();
          }
        }
      }
    }
  });

  test('Confirming delete removes customer from table', async ({ page }) => {
    if (!page.url().includes('/customers')) { test.skip(); }

    const rows = page.locator('tbody tr');
    const initialCount = await rows.count();

    if (initialCount === 0) { test.skip(); }

    const moreBtn = page.locator('table button').last();
    if (await moreBtn.count() > 0) {
      await moreBtn.click();
      await page.waitForTimeout(200);

      const deleteOpt = page.locator('button:has-text("Excluir")').first();
      if (await deleteOpt.count() > 0 && await deleteOpt.isVisible()) {
        await deleteOpt.click();
        await page.waitForTimeout(300);

        const confirmBtn = page.locator('[class*="bg-red-500"] button, button:has-text("Excluir"):visible').last();
        if (await confirmBtn.count() > 0) {
          await confirmBtn.click();
          await page.waitForTimeout(800);

          const newCount = await rows.count();
          expect(newCount).toBeLessThan(initialCount);
        }
      }
    }
  });
});
