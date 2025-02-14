import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable cookie parsing
  app.use(cookieParser());
  app.enableCors();
  // Debug MongoDB connection
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB Connection Error:', err);
  });

  mongoose.connection.once('open', () => {
    console.log('✅ Connected to MongoDB');
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
