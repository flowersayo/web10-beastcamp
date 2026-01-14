import { Injectable, Inject, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_KEYS, PROVIDERS } from '@beastcamp/shared-constants';

interface RedisWithCommands extends Redis {
  transferUser(
    waitQ: string,
    activeQ: string,
    maxCapacity: number,
    now: string,
  ): Promise<string[]>;
}

@Injectable()
export class QueueWorker {
  private readonly logger = new Logger(QueueWorker.name);
  private MAX_CAPACITY = 10; // 활성 큐 최대 용량

  constructor(
    @Inject(PROVIDERS.REDIS_QUEUE) private readonly redis: RedisWithCommands,
  ) {}

  async processQueueTransfer() {
    try {
      const movedUsers = await this.redis.transferUser(
        REDIS_KEYS.WAITING_QUEUE,
        REDIS_KEYS.ACTIVE_QUEUE,
        this.MAX_CAPACITY,
        Date.now().toString(),
      );

      if (movedUsers.length > 0) {
        this.logger.log(
          `🚀 [입장] 유저 ${movedUsers.join(', ')}님이 활성 큐로 이동했습니다.`,
        );
      }
    } catch (error) {
      this.logger.error('대기열 스케줄링 중 오류 발생:', error);
    }
  }
}
