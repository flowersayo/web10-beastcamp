import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  PROVIDERS,
  REDIS_CHANNELS,
  REDIS_KEYS,
} from '@beastcamp/shared-constants';
import Redis from 'ioredis';

@Injectable()
export class TicketingStateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TicketingStateService.name);

  private cachedSessionId: string | null | undefined = undefined;
  private cachedIsOpen: boolean | undefined = undefined;

  private lastSyncAt = 0;
  private readonly CACHE_TTL = 1000;
  private subscriber: Redis | null = null;

  constructor(
    @Inject(PROVIDERS.REDIS_TICKET) private readonly ticketRedis: Redis,
  ) {}

  async onModuleInit(): Promise<void> {
    this.subscriber = this.ticketRedis.duplicate();
    await this.subscriber.subscribe(REDIS_CHANNELS.TICKETING_STATE_CHANGED);
    this.subscriber.on('message', (channel: string) => {
      if (channel === REDIS_CHANNELS.TICKETING_STATE_CHANGED) {
        this.lastSyncAt = 0;
        void this.refreshIfNeeded();
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }
  }

  /**
   * 상태 동기화 (내부 전용)
   * 1초가 지났을 때만 Redis에서 최신 정보를 가져옵니다.
   */
  private async refreshIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastSyncAt < this.CACHE_TTL) return;

    this.lastSyncAt = now;

    try {
      const [isOpen, sessionId] = await Promise.all([
        this.ticketRedis.get(REDIS_KEYS.TICKETING_OPEN),
        this.ticketRedis.get(REDIS_KEYS.CURRENT_TICKETING_SESSION),
      ]);

      this.cachedIsOpen = isOpen === 'true';
      this.cachedSessionId = sessionId;
    } catch (error) {
      this.logger.error(
        '티켓팅 상태 동기화 실패 (기존 상태 유지):',
        (error as Error).message,
      );
    }
  }

  /**
   * 티켓팅 오픈 여부 반환
   */
  async isOpen(): Promise<boolean> {
    await this.refreshIfNeeded();
    return this.cachedIsOpen ?? false;
  }

  /**
   * 현재 진행 중인 세션 ID 반환
   */
  async currentSessionId(): Promise<string | null> {
    await this.refreshIfNeeded();
    return this.cachedSessionId ?? null;
  }
}
