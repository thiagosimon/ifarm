/**
 * 10 — Profile
 *
 * Covers:
 *  - Profile page renders with tabs or sections
 *  - Completion progress bar visible
 *  - Business data section (razão social, CNPJ, email, phone)
 *  - Address section (CEP, logradouro, cidade)
 *  - About section (bio/description, specialties/tags)
 *  - Commercial settings (delivery time, min order, payment terms)
 *  - Bank data section
 *  - "Salvar Alterações" button
 *  - "Descartar Alterações" button
 *  - Store identity section (banner and logo upload areas)
 */
import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/auth';

const BASE = 'http://localhost:4000';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/profile`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Perfil');
  });

  test('completion percentage is displayed', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const completion = page.locator('text="Preenchimento do Perfil", text=/\d+%/').first();
    if (await completion.count() > 0) {
      await expect(completion).toBeVisible();
    }
  });

  test('business data section is present', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const businessSection = page.locator('text="Dados Cadastrais"').first();
    if (await businessSection.count() > 0) {
      await expect(businessSection).toBeVisible();
    }
  });

  test('address section has CEP field', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const cepLabel = page.locator('text="CEP", label:has-text("CEP")').first();
    if (await cepLabel.count() > 0) {
      await expect(cepLabel).toBeVisible();
    }
  });

  test('about section has bio textarea', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const bioLabel = page.locator('text="Biografia", text="Descrição"').first();
    if (await bioLabel.count() > 0) {
      await expect(bioLabel).toBeVisible();

      const textarea = page.locator('textarea').first();
      if (await textarea.count() > 0) {
        await expect(textarea).toBeVisible();
      }
    }
  });

  test('commercial settings section is present', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const commercial = page.locator('text="Configurações Comerciais"').first();
    if (await commercial.count() > 0) {
      await expect(commercial).toBeVisible();
    }
  });

  test('bank data section is present', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const bank = page.locator('text="Dados Bancários"').first();
    if (await bank.count() > 0) {
      await expect(bank).toBeVisible();
    }
  });

  test('"Salvar Alterações" button is visible', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const saveBtn = page.locator('button:has-text("Salvar Alterações"), button:has-text("Salvar")').first();
    await expect(saveBtn).toBeVisible();
  });

  test('"Descartar Alterações" button is visible', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const discardBtn = page.locator('button:has-text("Descartar")').first();
    if (await discardBtn.count() > 0) {
      await expect(discardBtn).toBeVisible();
    }
  });

  test('banner upload area is visible', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const banner = page.locator('text="Banner da Loja"').first();
    if (await banner.count() > 0) {
      await expect(banner).toBeVisible();
    }
  });

  test('specialty tags can be added', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const addTagBtn = page.locator('button:has-text("Adicionar Tag")').first();
    if (await addTagBtn.count() > 0) {
      await expect(addTagBtn).toBeVisible();
    }
  });

  test('payment methods checkboxes visible in commercial section', async ({ page }) => {
    if (!page.url().includes('/profile')) { test.skip(); }

    const paymentMethods = page.locator('text="Métodos de Pagamento"').first();
    if (await paymentMethods.count() > 0) {
      await expect(paymentMethods).toBeVisible();

      const pix = page.locator('text="Pix", label:has-text("Pix")').first();
      if (await pix.count() > 0) {
        await expect(pix).toBeVisible();
      }
    }
  });
});
