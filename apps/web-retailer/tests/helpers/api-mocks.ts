/**
 * API mock helpers — intercept api-gateway calls and return realistic fixture data.
 *
 * All routes follow the pattern: http://localhost:3100/api/v1/...
 */
import { BrowserContext } from '@playwright/test';

const GW = 'http://localhost:3100';

// ─── Fixtures ──────────────────────────────────────────────────────────────

export const MOCK_TEAM_MEMBERS = [
  { _id: 'tm-001', name: 'Carlos Silva', email: 'carlos@agrosilva.com.br', role: 'admin', status: 'active' },
  { _id: 'tm-002', name: 'Maria Oliveira', email: 'maria@agrosilva.com.br', role: 'manager', status: 'active' },
  { _id: 'tm-003', name: 'João Santos', email: 'joao@agrosilva.com.br', role: 'operator', status: 'invited' },
];

export const MOCK_CUSTOMERS = [
  { _id: 'cu-001', name: 'Fazenda Santa Clara', email: 'contato@santaclara.agr.br', phone: '(16) 99123-4567', city: 'Ribeirão Preto', state: 'SP', status: 'active', totalSpent: 245800, orders: 12 },
  { _id: 'cu-002', name: 'Agropecuária Três Rios', email: 'compras@tresrios.com.br', phone: '(34) 98876-5432', city: 'Uberlândia', state: 'MG', status: 'active', totalSpent: 189500, orders: 8 },
  { _id: 'cu-003', name: 'Granja Esperança', email: 'granja@esperanca.com.br', phone: '(44) 98234-5678', city: 'Maringá', state: 'PR', status: 'inactive', totalSpent: 52300, orders: 3 },
];

export const MOCK_QUOTATIONS = [
  {
    id: 'cot-001', number: 'COT-2024-001', status: 'open', urgency: 'urgent',
    producer: 'Fazenda Boa Vista', products: 'Fertilizante NPK 10-10-10',
    quantity: '500 sacas', estimatedValue: 45000, expiresAt: '2024-03-25',
    category: 'fertilizers', state: 'SP',
  },
  {
    id: 'cot-002', number: 'COT-2024-002', status: 'pending', urgency: 'normal',
    producer: 'Cooperativa Verde', products: 'Sementes de Soja',
    quantity: '200 sacas', estimatedValue: 28000, expiresAt: '2024-03-30',
    category: 'seeds', state: 'MG',
  },
];

export const MOCK_ORDERS = [
  {
    id: 'ord-001', number: '#1847', status: 'preparing',
    customer: 'Fazenda Santa Clara', city: 'Ribeirão Preto', state: 'SP',
    total: 45800, date: '2024-01-20',
    items: [{ name: 'Fertilizante NPK 10-10-10', qty: 10, unit: 'saca', price: 4580 }],
  },
  {
    id: 'ord-002', number: '#1842', status: 'shipped',
    customer: 'Cooperativa Verde', city: 'Goiânia', state: 'GO',
    total: 32000, date: '2024-01-18', trackingCode: 'LOG123456BR',
    items: [{ name: 'Sementes de Milho', qty: 50, unit: 'saca', price: 640 }],
  },
  {
    id: 'ord-003', number: '#1835', status: 'delivered',
    customer: 'Sítio Bela Vista', city: 'Campinas', state: 'SP',
    total: 15200, date: '2024-01-10',
    items: [{ name: 'Defensivo Agrícola', qty: 20, unit: 'unidade', price: 760 }],
  },
];

export const MOCK_CATALOG = [
  { id: 'prod-001', name: 'Fertilizante NPK 10-10-10', category: 'fertilizers', brand: 'AgroNutri', sku: 'FERT-NPK-1010', price: 450, stock: 150, status: 'active' },
  { id: 'prod-002', name: 'Semente de Soja RR', category: 'seeds', brand: 'SeedTech', sku: 'SEED-SOJ-RR', price: 1200, stock: 80, status: 'active' },
  { id: 'prod-003', name: 'Herbicida Roundup', category: 'pesticides', brand: 'Bayer', sku: 'HERB-RND-001', price: 320, stock: 0, status: 'inactive' },
];

// ─── Setup helpers ──────────────────────────────────────────────────────────

/** Mocks all team-members CRUD endpoints */
export async function mockTeamMembersAPI(context: BrowserContext) {
  let members = [...MOCK_TEAM_MEMBERS];

  await context.route(`${GW}/api/v1/identity/team-members`, async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ statusCode: 200, data: members }) });
    } else if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      const newMember = { _id: `tm-${Date.now()}`, ...body, status: body.status ?? 'active' };
      members.push(newMember);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ statusCode: 201, data: newMember }) });
    }
  });

  await context.route(`${GW}/api/v1/identity/team-members/**`, async route => {
    const id = route.request().url().split('/').pop();
    const method = route.request().method();

    if (method === 'GET') {
      const m = members.find(x => x._id === id);
      await route.fulfill({ status: m ? 200 : 404, contentType: 'application/json', body: JSON.stringify({ data: m }) });
    } else if (method === 'PATCH') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      const idx = members.findIndex(x => x._id === id);
      if (idx >= 0) { members[idx] = { ...members[idx], ...body }; }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: members[idx] }) });
    } else if (method === 'DELETE') {
      members = members.filter(x => x._id !== id);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'deleted' }) });
    }
  });
}

/** Mocks all customers CRUD endpoints */
export async function mockCustomersAPI(context: BrowserContext) {
  let customers = [...MOCK_CUSTOMERS];

  await context.route(`${GW}/api/v1/identity/customers`, async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ statusCode: 200, data: customers }) });
    } else if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      const newCustomer = { _id: `cu-${Date.now()}`, totalSpent: 0, orders: 0, status: 'active', ...body };
      customers.push(newCustomer);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ statusCode: 201, data: newCustomer }) });
    }
  });

  await context.route(`${GW}/api/v1/identity/customers/**`, async route => {
    const id = route.request().url().split('/').pop();
    const method = route.request().method();

    if (method === 'PATCH') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      const idx = customers.findIndex(x => x._id === id);
      if (idx >= 0) { customers[idx] = { ...customers[idx], ...body }; }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: customers[idx] }) });
    } else if (method === 'DELETE') {
      customers = customers.filter(x => x._id !== id);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'deleted' }) });
    }
  });
}

/** Mocks auth-service login endpoint */
export async function mockAuthAPI(context: BrowserContext) {
  await context.route(`${GW}/api/v1/auth/login`, async route => {
    const body = JSON.parse(route.request().postData() ?? '{}');
    if (body.email === 'lojista@ifarm.com.br' && body.password === '12345678') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),
      });
    } else {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid credentials' }) });
    }
  });

  await context.route(`${GW}/api/v1/auth/register`, async route => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ message: 'User created' }) });
  });

  await context.route(`${GW}/api/v1/identity/retailers`, async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 201,
          data: { id: 'retailer-001', email: 'test@example.com', status: 'pending' },
        }),
      });
    }
  });
}

/** Records API call errors for reporting */
export async function trackAPIErrors(context: BrowserContext, errors: string[]) {
  context.on('response', response => {
    const url = response.url();
    if (url.includes('/api/') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.request().method()} ${url}`);
    }
  });
}
