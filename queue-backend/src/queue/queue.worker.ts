import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  REDIS_KEYS,
  PROVIDERS,
  REDIS_KEY_PREFIXES,
} from '@beastcamp/shared-constants';
import {
  getBooleanFromEnv,
  getNumberFromEnv,
  getQueueBooleanField,
  getQueueNumberField,
  seedQueueBooleanField,
  seedQueueNumberField,
} from './queue-config.util';

interface RedisWithCommands extends Redis {
  syncAndPromoteWaiters(
    waitQ: string,
    activeQ: string,
    heartbeatQ: string,
    virtualActiveQ: string,
    maxCapacity: number,
    now: number,
    heartbeatTimeoutMs: number,
    activeTTLMs: number,
    activeUserPrefix: string,
    heartbeatEnabled: boolean,
  ): Promise<string[]>;
}

@Injectable()
export class QueueWorker implements OnModuleInit {
  private readonly logger = new Logger(QueueWorker.name);
  private isActive = false;

  constructor(
    @Inject(PROVIDERS.REDIS_QUEUE) private readonly redis: RedisWithCommands,
  ) {}

  async onModuleInit(): Promise<void> {
    await seedQueueNumberField(
      this.redis,
      'worker.max_capacity',
      getNumberFromEnv('QUEUE_MAX_CAPACITY'),
      10,
    );
    await seedQueueNumberField(
      this.redis,
      'worker.heartbeat_timeout_ms',
      getNumberFromEnv('QUEUE_HEARTBEAT_TIMEOUT_MS'),
      60000,
    );
    await seedQueueNumberField(
      this.redis,
      'worker.active_ttl_ms',
      getNumberFromEnv('QUEUE_ACTIVE_TTL_MS'),
      300000,
    );
    await seedQueueBooleanField(
      this.redis,
      'heartbeat.enabled',
      getBooleanFromEnv('QUEUE_HEARTBEAT_ENABLED'),
      true,
    );
  }

  async processQueueTransfer() {
    if (this.isActive) {
      this.logger.debug('🚫 이미 활성 큐 처리 중입니다.');
      return;
    }

    this.isActive = true;

    try {
      const config = await this.loadWorkerConfig();
      const movedUsers = await this.redis.syncAndPromoteWaiters(
        REDIS_KEYS.WAITING_QUEUE,
        REDIS_KEYS.ACTIVE_QUEUE,
        REDIS_KEYS.HEARTBEAT_QUEUE,
        REDIS_KEYS.VIRTUAL_ACTIVE_QUEUE,
        config.maxCapacity,
        Date.now(),
        config.heartbeatTimeoutMs,
        config.activeTTLMs,
        REDIS_KEY_PREFIXES.ACTIVE_USER,
        config.heartbeatEnabled,
      );

      if (movedUsers.length > 0) {
        this.logger.log(
          `🚀 [입장] 유저 ${movedUsers.join(', ')}님이 활성 큐로 이동했습니다.`,
        );
      }
    } catch (error) {
      this.logger.error('대기열 스케줄링 중 오류 발생:', error);
    }

    this.isActive = false;
  }

  async removeActiveUser(userId: string) {
    if (!userId) {
      return;
    }

    const statusKey = `${REDIS_KEY_PREFIXES.ACTIVE_USER}${userId}`;

    try {
      const removed = await this.redis.zrem(REDIS_KEYS.ACTIVE_QUEUE, userId);
      await this.redis.del(statusKey);

      if (removed > 0) {
        this.logger.log(
          `🛑 [퇴장] 유저 ${userId}님을 활성 큐에서 제거했습니다.`,
        );
      }
    } catch (error) {
      this.logger.error('활성 큐 제거 중 오류 발생:', error);
    }
  }

  private async loadWorkerConfig() {
    const maxCapacity = await getQueueNumberField(
      this.redis,
      'worker.max_capacity',
      10,
      { min: 1 },
    );
    const heartbeatTimeoutMs = await getQueueNumberField(
      this.redis,
      'worker.heartbeat_timeout_ms',
      60000,
      { min: 1000 },
    );
    const activeTTLMs = await getQueueNumberField(
      this.redis,
      'worker.active_ttl_ms',
      300000,
      { min: 1000 },
    );
    const heartbeatEnabled = await getQueueBooleanField(
      this.redis,
      'heartbeat.enabled',
      true,
    );

    return { maxCapacity, heartbeatTimeoutMs, activeTTLMs, heartbeatEnabled };
  }
}
