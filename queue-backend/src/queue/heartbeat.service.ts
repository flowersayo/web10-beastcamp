import { PROVIDERS, REDIS_KEYS } from '@beastcamp/shared-constants';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import {
  getBooleanFromEnv,
  getNumberFromEnv,
  getQueueBooleanField,
  getQueueNumberField,
  seedQueueBooleanField,
  seedQueueNumberField,
} from './queue-config.util';

@Injectable()
export class HeartbeatService implements OnModuleInit {
  private readonly heartbeatCache = new Map<string, number>();
  private configCache: {
    isEnabled: boolean;
    throttleMs: number;
    cacheMaxSize: number;
  } | null = null;
  private lastConfigLoadAt = 0;
  private readonly configCacheTtlMs = 1000;

  constructor(@Inject(PROVIDERS.REDIS_QUEUE) private readonly redis: Redis) {}

  async onModuleInit(): Promise<void> {
    await seedQueueBooleanField(
      this.redis,
      'heartbeat.enabled',
      getBooleanFromEnv('QUEUE_HEARTBEAT_ENABLED'),
      true,
    );
    await seedQueueNumberField(
      this.redis,
      'heartbeat.throttle_ms',
      getNumberFromEnv('QUEUE_HEARTBEAT_THROTTLE_MS'),
      1000,
    );
    await seedQueueNumberField(
      this.redis,
      'heartbeat.cache_max_size',
      getNumberFromEnv('QUEUE_HEARTBEAT_CACHE_MAX_SIZE'),
      150000,
    );
  }

  async update(userId: string): Promise<void> {
    const config = await this.getConfig();
    if (!config.isEnabled) return;

    const now = Date.now();
    const lastUpdate = this.heartbeatCache.get(userId);

    if (lastUpdate && now - lastUpdate < config.throttleMs) {
      return;
    }

    await this.redis.zadd(REDIS_KEYS.HEARTBEAT_QUEUE, now, userId);
    this.heartbeatCache.set(userId, now);

    if (this.heartbeatCache.size > config.cacheMaxSize) {
      this.heartbeatCache.clear();
    }
  }

  private async getConfig() {
    const now = Date.now();
    if (
      this.configCache &&
      now - this.lastConfigLoadAt < this.configCacheTtlMs
    ) {
      return this.configCache;
    }

    const isEnabled = await getQueueBooleanField(
      this.redis,
      'heartbeat.enabled',
      true,
    );
    const throttleMs = await getQueueNumberField(
      this.redis,
      'heartbeat.throttle_ms',
      1000,
      { min: 0 },
    );
    const cacheMaxSize = await getQueueNumberField(
      this.redis,
      'heartbeat.cache_max_size',
      150000,
      { min: 1 },
    );

    this.configCache = { isEnabled, throttleMs, cacheMaxSize };
    this.lastConfigLoadAt = now;
    return this.configCache;
  }
}
