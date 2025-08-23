import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';

// import dataSource from './data-source';
async function bootstrap() {
  // Optimize for production environment
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Reduce memory usage
    logger: isProduction
      ? ['error', 'warn']
      : ['log', 'error', 'warn', 'debug'],
  });

  // Configure static file serving for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // await dataSource.initialize();
  // await dataSource.runMigrations();

  // Only enable Swagger in development
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('rabbit')
      .setDescription('The rabbit API description')
      .setVersion('1.0')
      .addBearerAuth() // Add Bearer Auth to Swagger
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  // Reduce body parser limits to save memory
  const bodyLimit = isProduction ? '10mb' : '50mb';
  app.use(bodyParser.json({ limit: bodyLimit }));
  app.use(bodyParser.urlencoded({ extended: true, limit: bodyLimit }));

  app.use(LoggerMiddleware);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // <- This line here
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Apply global exception filters
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new NotFoundExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
