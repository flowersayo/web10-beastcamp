import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PROVIDERS, CONFIG_PATHS } from '@beastcamp/shared-constants';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: PROVIDERS.REDIS_TICKET as string,
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          CONFIG_PATHS.REDIS_TICKET_HOST as string,
        );
        const port = configService.get<number>(
          CONFIG_PATHS.REDIS_TICKET_PORT as string,
        );
        const password = configService.get<string>(
          CONFIG_PATHS.REDIS_TICKET_PASSWORD as string,
        );

        return new Redis({
          host,
          port,
          password,
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: PROVIDERS.REDIS_QUEUE as string,
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          CONFIG_PATHS.REDIS_QUEUE_HOST as string,
        );
        const port = configService.get<number>(
          CONFIG_PATHS.REDIS_QUEUE_PORT as string,
        );
        const password = configService.get<string>(
          CONFIG_PATHS.REDIS_QUEUE_PASSWORD as string,
        );

        return new Redis({
          host,
          port,
          password,
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [
    PROVIDERS.REDIS_TICKET as string,
    PROVIDERS.REDIS_QUEUE as string,
    RedisService,
  ],
})
export class RedisModule {}
