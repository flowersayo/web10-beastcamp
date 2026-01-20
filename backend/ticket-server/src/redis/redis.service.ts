import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { PROVIDERS } from '@beastcamp/shared-constants';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject(PROVIDERS.REDIS_TICKET)
    private readonly client: Redis,
  ) {}

  onModuleDestroy() {
    this.client.disconnect();
  }

  async setNx(key: string, value: string): Promise<boolean> {
    const result = await this.client.setnx(key, value);
    return result === 1;
  }

  async set(key: string, value: string): Promise<string> {
    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    if (keys.length === 0) return [];
    return this.client.mget(...keys);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  async flushAll(): Promise<string> {
    return this.client.flushall();
  }
}
