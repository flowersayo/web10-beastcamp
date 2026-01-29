import Redis from 'ioredis';
import { REDIS_KEYS } from '@beastcamp/shared-constants';

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

export function getBooleanFromEnv(envKey: string): boolean | undefined {
  const raw = process.env[envKey];
  if (raw === undefined) return undefined;
  const lowered = raw.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(lowered)) return true;
  if (['0', 'false', 'no', 'off'].includes(lowered)) return false;
  return undefined;
}

export async function seedQueueNumberField(
  redis: Redis,
  field: string,
  envValue: number | undefined,
  defaultValue: number,
): Promise<void> {
  if (envValue !== undefined) {
    await redis.hset(REDIS_KEYS.CONFIG_QUEUE, field, String(envValue));
    return;
  }
  await redis.hsetnx(REDIS_KEYS.CONFIG_QUEUE, field, String(defaultValue));
}

export async function seedQueueBooleanField(
  redis: Redis,
  field: string,
  envValue: boolean | undefined,
  defaultValue: boolean,
): Promise<void> {
  if (envValue !== undefined) {
    await redis.hset(REDIS_KEYS.CONFIG_QUEUE, field, String(envValue));
    return;
  }
  await redis.hsetnx(REDIS_KEYS.CONFIG_QUEUE, field, String(defaultValue));
}

export async function getQueueNumberField(
  redis: Redis,
  field: string,
  defaultValue: number,
  options: NumberFieldOptions = {},
): Promise<number> {
  const raw = await redis.hget(REDIS_KEYS.CONFIG_QUEUE, field);
  const value = raw === null ? defaultValue : Number(raw);
  if (!Number.isFinite(value)) return defaultValue;

  const min = options.min ?? Number.NEGATIVE_INFINITY;
  const max = options.max ?? Number.POSITIVE_INFINITY;
  return Math.min(max, Math.max(min, value));
}

export async function getQueueBooleanField(
  redis: Redis,
  field: string,
  defaultValue: boolean,
): Promise<boolean> {
  const raw = await redis.hget(REDIS_KEYS.CONFIG_QUEUE, field);
  if (raw === null) return defaultValue;
  const lowered = raw.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(lowered)) return true;
  if (['0', 'false', 'no', 'off'].includes(lowered)) return false;
  return defaultValue;
}
