import { Logger } from "@nestjs/common";
import { Redis } from "ioredis";

export class DynamicConfigManager {
  private readonly logger = new Logger(DynamicConfigManager.name);

  private readonly redis: Redis;
  private readonly key: string;
  private readonly ttl: number;

  private cache: Record<string, string> = {};

  private lastFetchTime = 0;
  private isInitialized = false;

  constructor(redis: Redis, key: string, options: { ttl?: number } = {}) {
    this.redis = redis;
    this.key = key;
    this.ttl = options.ttl ?? 5000;
  }

  /**
   * [비동기] 데이터 동기화
   * 루프 시작점에서 반드시 호출해야 함.
   */
  async refresh(force = false): Promise<void> {
    const now = Date.now();
    if (!force && this.isInitialized && now - this.lastFetchTime < this.ttl) {
      return;
    }

    try {
      const result = await this.redis.hgetall(this.key);
      this.cache = result || {};
      this.lastFetchTime = now;
      this.isInitialized = true;
    } catch (error) {
      this.logger.warn(
        `[${this.key}] Refresh가 실패했습니다. ${this.isInitialized ? "오래된 캐시를 사용합니다." : "초기 데이터가 없습니다."} Error: ${
          error instanceof Error ? error.message : "Unknown"
        }`,
      );
    }
  }

  private getRaw(field: string): string | undefined {
    if (!this.isInitialized) {
      this.logger.warn(
        `[${this.key}] 필드 "${field}" 접근 전 초기화 여부를 확인하세요. refresh()가 호출되었는지 확인하세요.`,
      );
    }
    return this.cache[field];
  }

  getNumber(
    field: string,
    defaultValue: number,
    options: { min?: number; max?: number } = {},
  ): number {
    const raw = this.getRaw(field);
    if (raw === undefined || raw === "") {
      return defaultValue;
    }

    let val = Number(raw);
    if (isNaN(val)) {
      return defaultValue;
    }

    return Math.min(
      options.max ?? Infinity,
      Math.max(options.min ?? -Infinity, val),
    );
  }

  getBoolean(field: string, defaultValue: boolean): boolean {
    const raw = this.getRaw(field);
    if (raw === undefined || raw === "") {
      return defaultValue;
    }

    const lowered = raw.toLowerCase();
    const truthy = ["true", "1", "yes", "on"];
    const falsy = ["false", "0", "no", "off"];

    if (truthy.includes(lowered)) {
      return true;
    }
    if (falsy.includes(lowered)) {
      return false;
    }

    return defaultValue;
  }
}
