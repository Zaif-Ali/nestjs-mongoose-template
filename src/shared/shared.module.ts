import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisCacheService } from './services/redis-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [],
      inject: [ApiConfigService],
      useFactory: async (configService: ApiConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
          ttl: configService.get('REDIS_CACHE_TTL'),
          password: configService.get('REDIS_PASSWORD'),
        }),
      }),
    }),
  ],
  providers: [ApiConfigService, RedisCacheService],
  exports: [ApiConfigService, CacheModule, RedisCacheService],
})
export class SharedModule {}
