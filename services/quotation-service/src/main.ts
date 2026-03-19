import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3004;

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const pinoLogger = pino({
    level: process.env.LOG_LEVEL || 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino/file', options: { destination: 1 } }
        : undefined,
  });

  app.use(
    pinoHttp({
      logger: pinoLogger,
      autoLogging: {
        ignore: (req: any) =>
          req.url === '/health' || req.url === '/v1/health' || req.url === '/metrics' || req.url === '/v1/metrics',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('v1');

  await app.listen(port);
  logger.log(`Quotation-service running on port ${port}`);
}

bootstrap();
