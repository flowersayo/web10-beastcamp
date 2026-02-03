import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { GlobalExceptionFilter } from '@beastcamp/shared-nestjs/errors/global-exception.filter';
import { TraceMiddleware } from '@beastcamp/shared-nestjs/trace/trace.middleware';
import { TraceModule } from '@beastcamp/shared-nestjs/trace/trace.module';
import { jwtConfig, redisConfig } from '@beastcamp/shared-nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [redisConfig, jwtConfig],
    }),
    RedisModule,
    QueueModule,
    TraceModule,
  ],
  providers: [GlobalExceptionFilter, TraceMiddleware],
})
export class AppModule {}
