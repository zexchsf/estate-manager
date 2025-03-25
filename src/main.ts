import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parsing
  app.use(cookieParser());
  app.enableShutdownHooks();
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3400',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Debug MongoDB connection
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB Connection Error:', err);
  });

  mongoose.connection.once('open', () => {
    console.log('✅ Connected to MongoDB');
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Estate Manager API')
    .setDescription('API documentation for Estate Mamnagement App')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3400, '0.0.0.0');
}
bootstrap();
