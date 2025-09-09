import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let server: express.Express | null = null;

export async function getServer(): Promise<express.Express> {
  if (server) return server;

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('app.corsOrigin'),
  });

  await app.init();   // ⚡ don't call app.listen()
  server = expressApp;
  return server;
}
