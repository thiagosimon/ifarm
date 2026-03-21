import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  createProxyMiddleware,
  Options as ProxyOptions,
} from 'http-proxy-middleware';
import { ROUTE_MAP, RouteConfig } from '../config/routes.config';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);
  private readonly proxies = new Map<string, ReturnType<typeof createProxyMiddleware>>();

  constructor(private readonly circuitBreakerService: CircuitBreakerService) {
    this.initializeProxies();
  }

  private initializeProxies(): void {
    for (const route of ROUTE_MAP) {
      const proxyOptions: ProxyOptions = {
        target: route.target,
        changeOrigin: true,
        pathRewrite: {
          [`^${route.prefix}`]: route.pathRewriteTarget ?? '/v1',
        },
        timeout: 8000,
        proxyTimeout: 8000,
        on: {
          proxyReq: (proxyReq, req) => {
            // Forward all X- headers to downstream services
            const headers = [
              'x-user-id',
              'x-user-role',
              'x-tenant-id',
              'x-correlation-id',
            ];
            for (const header of headers) {
              const value = (req as Request).headers[header];
              if (value) {
                proxyReq.setHeader(header, value as string);
              }
            }
          },
          proxyRes: (proxyRes, req) => {
            this.logger.debug(
              `[${route.serviceName}] ${(req as Request).method} ${(req as Request).url} -> ${proxyRes.statusCode}`,
            );
          },
          error: (err, req, res) => {
            this.logger.error(
              `[${route.serviceName}] Proxy error for ${(req as Request).method} ${(req as Request).url}: ${err.message}`,
            );

            if (res && 'writeHead' in res && !res.headersSent) {
              (res as Response).status(502).json({
                statusCode: 502,
                message: `Service ${route.serviceName} is unavailable`,
                error: 'Bad Gateway',
              });
            }
          },
        },
      };

      const proxy = createProxyMiddleware(proxyOptions);
      this.proxies.set(route.prefix, proxy);

      this.logger.log(
        `Proxy configured: ${route.prefix}/* -> ${route.target} (${route.serviceName})`,
      );
    }
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const matchingRoute = this.findMatchingRoute(req.url);

    if (!matchingRoute) {
      next();
      return;
    }

    const proxy = this.proxies.get(matchingRoute.prefix);
    if (!proxy) {
      next();
      return;
    }

    const breakerState = this.circuitBreakerService.getState(
      matchingRoute.serviceName,
    );

    if (breakerState === 'open') {
      this.logger.warn(
        `Circuit breaker is open for ${matchingRoute.serviceName}. Rejecting request.`,
      );
      res.status(503).json({
        statusCode: 503,
        message: `Service ${matchingRoute.serviceName} is temporarily unavailable. Please try again later.`,
        error: 'Service Unavailable',
      });
      return;
    }

    proxy(req, res, next);
  }

  private findMatchingRoute(url: string): RouteConfig | undefined {
    const path = url.split('?')[0];
    return ROUTE_MAP.find((route) => path.startsWith(route.prefix));
  }
}
