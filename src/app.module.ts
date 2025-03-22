import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { ConfigModule } from '@nestjs/config';
import { envConfiguration } from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/.env.${process.env.NODE_ENV}`,
      load: [envConfiguration],
      isGlobal: true,
    }),
    SharedModule,
    DatabaseModule,
    QueuesModule,
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (apiConfigService: ApiConfigService) => ({
        throttlers: [
          {
            limit: apiConfigService.get('RATE_LIMITER_LIMIT'),
            ttl: apiConfigService.get('RATE_LIMITER_TTL'),
          },
        ],
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
