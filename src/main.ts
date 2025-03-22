import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import helmet from 'helmet';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import compression from 'compression';
import morgan from 'morgan';
import { RequestTransformInterceptor } from './interceptors/request-transform.interceptor';
import { HTTPExceptionFilter } from './filters/http-exception.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  // create a nest application with the Express application
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        origin: '*',
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
    },
  );
  // Express Application Middlewares
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Nginx, etc)
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));

  app.setGlobalPrefix('/api');

  app.useGlobalFilters(
    new HTTPExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new RequestTransformInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.select(SharedModule).get(ApiConfigService);
  await app.listen(configService.get('PORT'));
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
