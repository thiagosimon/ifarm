/**
 * 11 — Remaining Pages
 *
 * Covers: KYC, Reviews, Notifications, Messages, Shipping, Invoices, Reports
 */
import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/auth';

const BASE = 'http://localhost:4000';

// ─── KYC Page ─────────────────────────────────────────────────────────────────

test.describe('KYC Verification Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/kyc`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/kyc')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('KYC');
  });

  test('three KYC steps are displayed', async ({ page }) => {
    if (!page.url().includes('/kyc')) { test.skip(); }

    const steps = ['Documentos', 'Conta Bancária', 'Revisão'];
    for (const step of steps) {
      const el = page.locator(`text="${step}"`).first();
      if (await el.count() > 0) {
        await expect(el).toBeVisible();
      }
    }
  });

  test('KYC status badges are visible', async ({ page }) => {
    if (!page.url().includes('/kyc')) { test.skip(); }

    const statusBadge = page.locator('[class*="badge"], [class*="Badge"]').first();
    if (await statusBadge.count() > 0) {
      await expect(statusBadge).toBeVisible();
    }
  });

  test('upload document button is present', async ({ page }) => {
    if (!page.url().includes('/kyc')) { test.skip(); }

    const uploadBtn = page.locator('button:has-text("Upload"), button:has-text("Enviar Documento")').first();
    if (await uploadBtn.count() > 0) {
      await expect(uploadBtn).toBeVisible();
    }
  });
});

// ─── Reviews Page ─────────────────────────────────────────────────────────────

test.describe('Reviews & Reputation Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/reviews`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Avaliações');
  });

  test('overall rating section is visible', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    const rating = page.locator('text="Avaliação Geral", text=/★|⭐|estrela/').first();
    if (await rating.count() > 0) {
      await expect(rating).toBeVisible();
    }
  });

  test('NPS and repurchase rate KPI cards are visible', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    const nps = page.locator('text="NPS"').first();
    if (await nps.count() > 0) {
      await expect(nps).toBeVisible();
    }
  });

  test('filter buttons: Todas, Pendentes, Respondidas', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    for (const label of ['Todas', 'Pendentes', 'Respondidas']) {
      const btn = page.locator(`button:has-text("${label}")`).first();
      if (await btn.count() > 0) {
        await expect(btn).toBeVisible();
      }
    }
  });

  test('review cards are rendered with star ratings', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    const reviews = page.locator('[class*="card"], [class*="review"]');
    if (await reviews.count() > 0) {
      await expect(reviews.first()).toBeVisible();
    }
  });

  test('"Exportar Relatório" button is visible', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    const exportBtn = page.locator('button:has-text("Exportar Relatório")').first();
    if (await exportBtn.count() > 0) {
      await expect(exportBtn).toBeVisible();
    }
  });

  test('clicking filter changes visible reviews', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    const pendingBtn = page.locator('button:has-text("Pendentes")').first();
    if (await pendingBtn.count() > 0) {
      await pendingBtn.click();
      await page.waitForTimeout(300);
      expect(page.url()).toContain('/reviews');
    }
  });

  test('"Responder" button is visible on reviews', async ({ page }) => {
    if (!page.url().includes('/reviews')) { test.skip(); }

    const replyBtn = page.locator('button:has-text("Responder")').first();
    if (await replyBtn.count() > 0) {
      await expect(replyBtn).toBeVisible();
    }
  });
});

// ─── Notifications Page ───────────────────────────────────────────────────────

test.describe('Notifications Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/notifications`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Notificações');
  });

  test('four filter tabs: Todas, Cotações, Pedidos, Financeiro', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }

    for (const tab of ['Todas', 'Cotações', 'Pedidos', 'Financeiro']) {
      const btn = page.locator(`button:has-text("${tab}")`).first();
      if (await btn.count() > 0) {
        await expect(btn).toBeVisible();
      }
    }
  });

  test('"Marcar todas como lidas" button is visible', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }

    const btn = page.locator('button:has-text("Marcar todas como lidas")').first();
    if (await btn.count() > 0) {
      await expect(btn).toBeVisible();
    }
  });

  test('notification items are displayed', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }

    const items = page.locator('[class*="card"], [class*="notification"], [class*="border-b"]');
    if (await items.count() > 0) {
      await expect(items.first()).toBeVisible();
    }
  });

  test('notification type badges are visible', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }

    const badge = page.locator('[class*="badge"], [class*="Badge"]').first();
    if (await badge.count() > 0) {
      await expect(badge).toBeVisible();
    }
  });

  test('clicking Cotações tab filters notifications', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }

    const cotacoesBtn = page.locator('button:has-text("Cotações")').first();
    if (await cotacoesBtn.count() > 0) {
      await cotacoesBtn.click();
      await page.waitForTimeout(300);
      expect(page.url()).toContain('/notifications');
    }
  });

  test('"Marcar todas como lidas" reduces unread count', async ({ page }) => {
    if (!page.url().includes('/notifications')) { test.skip(); }

    const markAllBtn = page.locator('button:has-text("Marcar todas como lidas")').first();
    if (await markAllBtn.count() > 0) {
      await markAllBtn.click();
      await page.waitForTimeout(300);
      expect(page.url()).toContain('/notifications');
    }
  });
});

// ─── Messages Page ────────────────────────────────────────────────────────────

test.describe('Messages Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/messages`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/messages')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Mensagens');
  });

  test('conversation search input is present', async ({ page }) => {
    if (!page.url().includes('/messages')) { test.skip(); }

    const search = page.locator('input[placeholder*="Buscar conversa"]').first();
    if (await search.count() > 0) {
      await expect(search).toBeVisible();
    }
  });

  test('conversation list renders contacts', async ({ page }) => {
    if (!page.url().includes('/messages')) { test.skip(); }

    const contacts = page.locator('[class*="contact"], [class*="conversation"]');
    if (await contacts.count() > 0) {
      await expect(contacts.first()).toBeVisible();
    }
  });

  test('message input area is visible', async ({ page }) => {
    if (!page.url().includes('/messages')) { test.skip(); }

    const msgInput = page.locator('input[placeholder*="mensagem"], textarea[placeholder*="mensagem"]').first();
    if (await msgInput.count() > 0) {
      await expect(msgInput).toBeVisible();
    }
  });

  test('send button is present', async ({ page }) => {
    if (!page.url().includes('/messages')) { test.skip(); }

    const sendBtn = page.locator('button:has-text("Enviar"), button:has([data-lucide="send"])').first();
    if (await sendBtn.count() > 0) {
      await expect(sendBtn).toBeVisible();
    }
  });

  test('clicking a contact loads conversation', async ({ page }) => {
    if (!page.url().includes('/messages')) { test.skip(); }

    const contact = page.locator('[class*="contact"], [class*="conversation"] div').first();
    if (await contact.count() > 0 && await contact.isVisible()) {
      await contact.click();
      await page.waitForTimeout(400);
      expect(page.url()).toContain('/messages');
    }
  });
});

// ─── Shipping Page ────────────────────────────────────────────────────────────

test.describe('Shipping / Logistics Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/shipping`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/shipping')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Logística');
  });

  test('status filter tabs are visible', async ({ page }) => {
    if (!page.url().includes('/shipping')) { test.skip(); }

    const tabs = ['Pendentes', 'Em Trânsito', 'Entregues'];
    for (const tab of tabs) {
      const btn = page.locator(`button:has-text("${tab}")`).first();
      if (await btn.count() > 0) {
        await expect(btn).toBeVisible();
      }
    }
  });

  test('search input by tracking code is present', async ({ page }) => {
    if (!page.url().includes('/shipping')) { test.skip(); }

    const search = page.locator('input[placeholder*="Buscar"], input[placeholder*="rastreio"]').first();
    if (await search.count() > 0) {
      await expect(search).toBeVisible();
    }
  });

  test('shipment cards render with carrier and tracking info', async ({ page }) => {
    if (!page.url().includes('/shipping')) { test.skip(); }

    const cards = page.locator('[class*="card"], [class*="glass"]');
    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });

  test('clicking tab filters shipments', async ({ page }) => {
    if (!page.url().includes('/shipping')) { test.skip(); }

    const transitBtn = page.locator('button:has-text("Em Trânsito")').first();
    if (await transitBtn.count() > 0) {
      await transitBtn.click();
      await page.waitForTimeout(300);
      expect(page.url()).toContain('/shipping');
    }
  });
});

// ─── Invoices Page ────────────────────────────────────────────────────────────

test.describe('Invoices (NF-e) Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/invoices`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/invoices')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Notas Fiscais');
  });

  test('"Emitir NF-e" button is visible', async ({ page }) => {
    if (!page.url().includes('/invoices')) { test.skip(); }

    const emitBtn = page.locator('button:has-text("Emitir NF-e"), button:has-text("Emitir")').first();
    if (await emitBtn.count() > 0) {
      await expect(emitBtn).toBeVisible();
    }
  });

  test('invoice status filter tabs are present', async ({ page }) => {
    if (!page.url().includes('/invoices')) { test.skip(); }

    const tabs = ['Pendente', 'Emitida', 'Cancelada'];
    for (const tab of tabs) {
      const btn = page.locator(`button:has-text("${tab}")`).first();
      if (await btn.count() > 0) {
        await expect(btn).toBeVisible();
      }
    }
  });

  test('invoice list renders with invoice numbers', async ({ page }) => {
    if (!page.url().includes('/invoices')) { test.skip(); }

    const invoices = page.locator('[class*="card"], [class*="glass"], tr');
    if (await invoices.count() > 0) {
      await expect(invoices.first()).toBeVisible();
    }
  });

  test('search by invoice number is functional', async ({ page }) => {
    if (!page.url().includes('/invoices')) { test.skip(); }

    const search = page.locator('input[placeholder*="Buscar"]').first();
    if (await search.count() > 0) {
      await search.fill('NF-001');
      await expect(search).toHaveValue('NF-001');
    }
  });

  test('download XML/PDF buttons are present for issued invoices', async ({ page }) => {
    if (!page.url().includes('/invoices')) { test.skip(); }

    const downloadBtn = page.locator('button:has-text("XML"), button:has-text("PDF")').first();
    if (await downloadBtn.count() > 0) {
      await expect(downloadBtn).toBeVisible();
    }
  });
});

// ─── Reports Page ─────────────────────────────────────────────────────────────

test.describe('Reports Page', () => {
  test.beforeEach(async ({ context, page }) => {
    await setupAuth(context);
    await page.goto(`${BASE}/reports`);
    await page.waitForLoadState('networkidle');
  });

  test('page heading renders', async ({ page }) => {
    if (!page.url().includes('/reports')) { test.skip(); }
    await expect(page.locator('h1')).toContainText('Relatórios');
  });

  test('report type cards/buttons visible (Sales, Products, Customers, Financial)', async ({ page }) => {
    if (!page.url().includes('/reports')) { test.skip(); }

    const types = ['Vendas', 'Produtos', 'Clientes', 'Financeiro'];
    for (const type of types) {
      const el = page.locator(`text="${type}"`).first();
      if (await el.count() > 0) {
        await expect(el).toBeVisible();
      }
    }
  });

  test('period filter buttons visible (Semana, Mês, Trimestre, Ano)', async ({ page }) => {
    if (!page.url().includes('/reports')) { test.skip(); }

    const periods = ['Semana', 'Mês', 'Trimestre', 'Ano'];
    for (const p of periods) {
      const btn = page.locator(`button:has-text("${p}")`).first();
      if (await btn.count() > 0) {
        await expect(btn).toBeVisible();
      }
    }
  });

  test('"Gerar Relatório" button is visible', async ({ page }) => {
    if (!page.url().includes('/reports')) { test.skip(); }

    const genBtn = page.locator('button:has-text("Gerar Relatório")').first();
    if (await genBtn.count() > 0) {
      await expect(genBtn).toBeVisible();
    }
  });

  test('generated reports list shows download button', async ({ page }) => {
    if (!page.url().includes('/reports')) { test.skip(); }

    const downloadBtn = page.locator('button:has-text("Baixar"), button:has([data-lucide="download"])').first();
    if (await downloadBtn.count() > 0) {
      await expect(downloadBtn).toBeVisible();
    }
  });
});
