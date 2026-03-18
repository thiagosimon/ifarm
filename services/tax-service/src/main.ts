import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3009;

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(
    pinoHttp({
      logger: pino({
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino/file', options: { destination: 1 } }
            : undefined,
      }),
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

  app.enableCors();
  app.setGlobalPrefix('v1');

  await app.listen(port);
  logger.log(`Tax service running on port ${port}`);
}

bootstrap();
