import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // create a nest application with the Express application
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // query parser are extended
  app.set('queryParser', 'extended');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
