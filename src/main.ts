import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Starting app... Port 3020");
  await app.listen(3020);
}
bootstrap();
