import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3001;

  const pinoLogger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino/file', options: { destination: 1 } }
        : undefined,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(
    pinoHttp({
      logger: pinoLogger,
      autoLogging: {
        ignore: (req: any) =>
          req.url === '/health' || req.url === '/health/ready',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('', { exclude: ['health', 'health/ready', 'metrics'] });

  await app.listen(port);
  logger.log(`Identity Service running on port ${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
