import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.PORT || '3000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Configure Pino logger
  const pinoLogger = pino({
    level: nodeEnv === 'production' ? 'info' : 'debug',
    transport:
      nodeEnv !== 'production'
        ? { target: 'pino/file', options: { destination: 1 } }
        : undefined,
    formatters: {
      level(label: string) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
    },
  });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // HTTP request logging with pino-http
  app.use(
    pinoHttp({
      logger: pinoLogger,
      autoLogging: {
        ignore: (req: any) => {
          // Do not log health checks to avoid log noise
          return req.url === '/health' || req.url === '/ready' || req.url === '/metrics';
        },
      },
      customLogLevel: (_req: any, res: any, err: any) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      customSuccessMessage: (req: any, res: any) => {
        return `${req.method} ${req.url} ${res.statusCode}`;
      },
      customErrorMessage: (req: any, _res: any, err: any) => {
        return `${req.method} ${req.url} - ${err.message}`;
      },
    }),
  );

  // Security: Helmet with CSP, X-Frame-Options, HSTS
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-origin' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );

  // CORS configuration
  const allowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:4000'
  ).split(',');

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, mobile apps)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        pinoLogger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Correlation-Id',
      'X-Tenant-Id',
    ],
    exposedHeaders: [
      'X-Correlation-Id',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    credentials: true,
    maxAge: 3600,
  });

  // Remove X-Powered-By (also done by helmet, but explicit for safety)
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`API Gateway running on port ${port} [${nodeEnv}]`);
  logger.log(`Health check: http://localhost:${port}/health`);
  logger.log(`Readiness check: http://localhost:${port}/ready`);
  logger.log(`Metrics: http://localhost:${port}/metrics`);
}

bootstrap();
