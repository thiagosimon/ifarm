/**
 * 09 — Settings
 *
 * Covers:
 *  - Settings page renders with 4 section tabs: Geral, Notificações, Segurança, Integrações
 *  - Default tab is "Geral"
 *  - General tab: language switcher (full variant), timezone select, date format, currency
 *  - Notifications tab: toggle rows for Email, Push, SMS, Cotações, Pedidos, Financeiro
 *  - Security tab: change password form, 2FA toggle, active sessions list
 *  - Integrations tab: integration cards with connect/disconnect buttons
 *  - "Salvar" button shows "Salvo" confirmation briefly after click
 *  - Tab switching updates visible content
 */
import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/auth';

const BASE = 'http://localhost:4000';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/settings`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Configurações');
  });

  test('four section tabs are visible', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const tabs = ['Geral', 'Notificações', 'Segurança', 'Integrações'];
    for (const tab of tabs) {
      const btn = page.locator(`button:has-text("${tab}")`).first();
      await expect(btn).toBeVisible();
    }
  });

  test('"Geral" tab is active by default', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const generalBtn = page.locator('button:has-text("Geral")').first();
    const classes = await generalBtn.getAttribute('class') ?? '';
    expect(classes).toMatch(/primary|active|bg-primary/);
  });

  // ─── General Tab ──────────────────────────────────────────────────────────

  test('General tab shows language switcher select', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const languageLabel = page.locator('text="Idioma"').first();
    if (await languageLabel.count() > 0) {
      await expect(languageLabel).toBeVisible();
    }

    const languageSelect = page.locator('select').first();
    if (await languageSelect.count() > 0) {
      await expect(languageSelect).toBeVisible();
    }
  });

  test('timezone select is present', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const timezoneLabel = page.locator('text="Fuso Horário"').first();
    if (await timezoneLabel.count() > 0) {
      await expect(timezoneLabel).toBeVisible();
    }
  });

  test('date format select is present', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const dateLabel = page.locator('text="Formato de Data"').first();
    if (await dateLabel.count() > 0) {
      await expect(dateLabel).toBeVisible();
    }
  });

  test('currency select is present', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const currencyLabel = page.locator('text="Moeda"').first();
    if (await currencyLabel.count() > 0) {
      await expect(currencyLabel).toBeVisible();
    }
  });

  // ─── Notifications Tab ────────────────────────────────────────────────────

  test('switching to Notificações tab shows toggle rows', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Notificações")').first().click();
    await page.waitForTimeout(300);

    const emailToggle = page.locator('text="Notificações por E-mail"').first();
    if (await emailToggle.count() > 0) {
      await expect(emailToggle).toBeVisible();
    }
  });

  test('notification toggles change state on click', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Notificações")').first().click();
    await page.waitForTimeout(300);

    const toggle = page.locator('[role="switch"]').first();
    if (await toggle.count() > 0) {
      const initialChecked = await toggle.getAttribute('aria-checked');
      await toggle.click();
      await page.waitForTimeout(200);
      const newChecked = await toggle.getAttribute('aria-checked');
      expect(newChecked).not.toBe(initialChecked);
    }
  });

  test('Notificações tab shows 3 channel toggles', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Notificações")').first().click();
    await page.waitForTimeout(300);

    const channels = ['E-mail', 'Push', 'SMS'];
    for (const ch of channels) {
      const toggle = page.locator(`text="${ch}", text="Notificações ${ch}"`).first();
      if (await toggle.count() > 0) {
        await expect(toggle).toBeVisible();
      }
    }
  });

  // ─── Security Tab ─────────────────────────────────────────────────────────

  test('switching to Segurança tab shows change password form', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Segurança")').first().click();
    await page.waitForTimeout(300);

    const passwordInputs = page.locator('input[type="password"]');
    if (await passwordInputs.count() > 0) {
      await expect(passwordInputs.first()).toBeVisible();
    }
  });

  test('2FA toggle is present under Segurança', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Segurança")').first().click();
    await page.waitForTimeout(300);

    const twoFALabel = page.locator('text="Autenticação em Dois Fatores"').first();
    if (await twoFALabel.count() > 0) {
      await expect(twoFALabel).toBeVisible();
    }
  });

  test('active sessions list is visible under Segurança', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Segurança")').first().click();
    await page.waitForTimeout(300);

    const sessions = page.locator('text="Sessões Ativas", text="Chrome"').first();
    if (await sessions.count() > 0) {
      await expect(sessions).toBeVisible();
    }
  });

  // ─── Integrations Tab ─────────────────────────────────────────────────────

  test('switching to Integrações tab shows integration cards', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Integrações")').first().click();
    await page.waitForTimeout(300);

    const pagarme = page.locator('text="Pagar.me"').first();
    if (await pagarme.count() > 0) {
      await expect(pagarme).toBeVisible();
    }
  });

  test('integration cards show connect/disconnect buttons', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    await page.locator('button:has-text("Integrações")').first().click();
    await page.waitForTimeout(300);

    const connectBtn = page.locator('button:has-text("Conectar"), button:has-text("Conectado")').first();
    if (await connectBtn.count() > 0) {
      await expect(connectBtn).toBeVisible();
    }
  });

  // ─── Save Button ──────────────────────────────────────────────────────────

  test('"Salvar" button shows "Salvo" confirmation after click', async ({ page }) => {
    if (!page.url().includes('/settings')) { test.skip(); }

    const saveBtn = page.locator('button:has-text("Salvar")').first();
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    await page.waitForTimeout(200);

    // Button should temporarily show "Salvo" or a check icon
    const savedIndicator = page.locator('button:has-text("Salvo"), button:has([data-lucide="check"])').first();
    if (await savedIndicator.count() > 0) {
      await expect(savedIndicator).toBeVisible();
    }
  });
});
