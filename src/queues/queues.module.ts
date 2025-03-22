import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ApiConfigService],
    }),
    EmailModule,
  ],
  exports: [BullModule],
})
export class QueuesModule {}
