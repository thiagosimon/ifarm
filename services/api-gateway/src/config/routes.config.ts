export interface RouteConfig {
  prefix: string;
  target: string;
  serviceName: string;
}

export const ROUTE_MAP: RouteConfig[] = [
  {
    prefix: '/api/v1/identity',
    target: 'http://localhost:3001',
    serviceName: 'identity-service',
  },
  {
    prefix: '/api/v1/auth',
    target: 'http://localhost:3002',
    serviceName: 'auth-service',
  },
  {
    prefix: '/api/v1/catalog',
    target: 'http://localhost:3003',
    serviceName: 'catalog-service',
  },
  {
    prefix: '/api/v1/quotes',
    target: 'http://localhost:3004',
    serviceName: 'quotation-service',
  },
  {
    prefix: '/api/v1/orders',
    target: 'http://localhost:3006',
    serviceName: 'order-service',
  },
  {
    prefix: '/api/v1/payments',
    target: 'http://localhost:3007',
    serviceName: 'payment-service',
  },
  {
    prefix: '/api/v1/notifications',
    target: 'http://localhost:3010',
    serviceName: 'notification-service',
  },
  {
    prefix: '/api/v1/reviews',
    target: 'http://localhost:3011',
    serviceName: 'review-service',
  },
];

export interface PublicRoute {
  method: string;
  path: string;
}

export const PUBLIC_ROUTES: PublicRoute[] = [
  { method: 'POST', path: '/api/v1/identity/farmers' },
  { method: 'POST', path: '/api/v1/identity/retailers' },
  { method: 'POST', path: '/api/v1/auth/login' },
  { method: 'POST', path: '/api/v1/auth/refresh' },
  { method: 'GET', path: '/api/v1/catalog/products' },
  { method: 'GET', path: '/api/v1/catalog/products/:id' },
  { method: 'GET', path: '/health' },
  { method: 'GET', path: '/ready' },
];

/**
 * Checks whether a given request method + path matches a public route.
 * Supports simple :param matching.
 */
export function isPublicRoute(method: string, path: string): boolean {
  const normalizedPath = path.split('?')[0].replace(/\/+$/, '');

  for (const route of PUBLIC_ROUTES) {
    if (route.method !== method.toUpperCase()) {
      continue;
    }

    const routeSegments = route.path.split('/');
    const pathSegments = normalizedPath.split('/');

    if (routeSegments.length !== pathSegments.length) {
      continue;
    }

    let match = true;
    for (let i = 0; i < routeSegments.length; i++) {
      if (routeSegments[i].startsWith(':')) {
        continue;
      }
      if (routeSegments[i] !== pathSegments[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return true;
    }
  }

  return false;
}
