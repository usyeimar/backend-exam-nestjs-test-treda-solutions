import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Prefix
  app.setGlobalPrefix('api');

  // Security Headers and CORS
  app.use(helmet());
  app.enableCors();

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Docs
  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('The Inventory Management API description')
    .setContact('Inventory API', null, 'yeimar112003@gmail.com')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Redirect to docs
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/docs');
  });

  await app.listen(process.env.PORT || 3000);

  const httpUrl =
    process.env.URL || `http://localhost:${process.env.PORT || 3000}`;

  console.log('\n');
  console.log('======================================');
  console.log(`🚀 Servidor corriendo en la URL: ${httpUrl}`);

  console.log('======================================');
}

bootstrap();
