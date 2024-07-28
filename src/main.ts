import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runInCluster } from './runInCluster';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyInstance } from './http.server';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.APP_PORT ?? 3000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance()),
  );

  app.enableShutdownHooks();
  app.enableCors({
    methods: process.env.CORS_ALLOWED_METHODS.toString().split(','),
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS.toString().split(','),
    exposedHeaders: process.env.CORS_EXPOSE_HEADERS.toString().split(','),
    origin: process.env.CORS_ORIGIN.toString().split(','),
    optionsSuccessStatus: 200,
    credentials: true,
    maxAge: 86400,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  await app.listen(port);
}
runInCluster(bootstrap);
