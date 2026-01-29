import { REDIS_KEYS } from '@beastcamp/shared-constants';
import { RedisService } from '../redis/redis.service';

type NumberFieldOptions = {
  min?: number;
  max?: number;
};

export function getNumberFromEnv(envKey: string): number | undefined {
  const raw = process.env[envKey];
  if (raw === undefined) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export async function seedTicketNumberField(
  redisService: RedisService,
  field: string,
  envValue: number | undefined,
  defaultValue: number,
): Promise<void> {
  if (envValue !== undefined) {
    await redisService.hset(REDIS_KEYS.CONFIG_TICKET, field, String(envValue));
    return;
  }
  await redisService.hsetnx(
    REDIS_KEYS.CONFIG_TICKET,
    field,
    String(defaultValue),
  );
}

export async function getTicketNumberField(
  redisService: RedisService,
  field: string,
  defaultValue: number,
  options: NumberFieldOptions = {},
): Promise<number> {
  const raw = await redisService.hget(REDIS_KEYS.CONFIG_TICKET, field);
  const value = raw === null ? defaultValue : Number(raw);
  if (!Number.isFinite(value)) return defaultValue;

  const min = options.min ?? Number.NEGATIVE_INFINITY;
  const max = options.max ?? Number.POSITIVE_INFINITY;
  return Math.min(max, Math.max(min, value));
}
