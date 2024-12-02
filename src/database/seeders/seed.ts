import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { seed } from './index';

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  await seed();
  await app.close();
}

bootstrap();
