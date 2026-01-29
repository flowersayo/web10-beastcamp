import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ReservationService } from '../reservation/reservation.service';
import {
  getTicketNumberField,
  seedTicketNumberField,
} from '../config/ticket-config.util';
import { REDIS_KEYS } from '@beastcamp/shared-constants';

@Injectable()
export class VirtualUserWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(VirtualUserWorker.name);
  private isRunning = false;

  constructor(
    private readonly redisService: RedisService,
    private readonly reservationService: ReservationService,
  ) {}

  async onModuleInit() {
    await seedTicketNumberField(
      this.redisService,
      'virtual.brpop_timeout_sec',
      undefined,
      2,
    );
    await seedTicketNumberField(
      this.redisService,
      'virtual.max_seat_attempts',
      undefined,
      10,
    );
    await seedTicketNumberField(
      this.redisService,
      'virtual.error_delay_ms',
      undefined,
      500,
    );
    await seedTicketNumberField(
      this.redisService,
      'virtual.process_delay_ms',
      undefined,
      0,
    );

    this.isRunning = true;
    void this.consumeLoop();
  }

  onModuleDestroy() {
    this.isRunning = false;
  }

  private async consumeLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        const enabled = await this.isVirtualUserEnabled();
        if (!enabled) {
          const config = await this.getVirtualConfig();
          await this.delay(config.errorDelayMs);
          continue;
        }

        const config = await this.getVirtualConfig();
        const result = await this.redisService.brpopQueueList(
          REDIS_KEYS.VIRTUAL_ACTIVE_QUEUE,
          config.brpopTimeoutSeconds,
        );

        if (!this.isRunning) {
          return;
        }

        if (!result) {
          continue;
        }

        const [, userId] = result;
        await this.processVirtualUser(userId, config.maxSeatPickAttempts);
        if (config.processDelayMs > 0) {
          await this.delay(config.processDelayMs);
        }
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        this.logger.error(
          `가상 유저 처리 루프 오류: ${err.message}`,
          err.stack,
        );
        const config = await this.getVirtualConfig();
        await this.delay(config.errorDelayMs);
      }
    }
  }

  private async processVirtualUser(
    userId: string,
    maxSeatPickAttempts: number,
  ): Promise<void> {
    const enabled = await this.isVirtualUserEnabled();
    if (!enabled) {
      this.logger.debug('가상 유저 예약 처리 비활성화 상태입니다.');
      return;
    }

    const sessionId = await this.redisService.get(
      REDIS_KEYS.CURRENT_TICKETING_SESSION,
    );
    if (!sessionId) {
      this.logger.warn(
        '가상 유저 처리 실패: 현재 티켓팅 회차가 설정되지 않았습니다.',
      );
      return;
    }

    const blockId = await this.redisService.srandmember(
      `session:${sessionId}:blocks`,
    );
    if (!blockId) {
      this.logger.warn(
        `가상 유저 처리 실패: 회차 ${sessionId}에 블록이 없습니다.`,
      );
      return;
    }

    const blockData = await this.redisService.get(`block:${blockId}`);
    if (!blockData) {
      this.logger.warn(`가상 유저 처리 실패: 블록 ${blockId} 정보가 없습니다.`);
      return;
    }

    const { rowSize, colSize } = JSON.parse(blockData) as {
      rowSize: number;
      colSize: number;
    };

    for (let attempt = 0; attempt < maxSeatPickAttempts; attempt++) {
      const row = Math.floor(Math.random() * rowSize);
      const col = Math.floor(Math.random() * colSize);

      try {
        await this.reservationService.reserve(
          {
            session_id: Number(sessionId),
            seats: [{ block_id: Number(blockId), row, col }],
          },
          userId,
        );
        this.logger.log(
          `가상 유저 예약 완료: user=${userId}, session=${sessionId}, block=${blockId}, row=${row}, col=${col}`,
        );
        return;
      } catch (error: unknown) {
        if (error instanceof ForbiddenException) {
          this.logger.debug('티켓팅이 열려있지 않아 가상 예약을 건너뜁니다.');
          return;
        }

        if (error instanceof BadRequestException) {
          continue;
        }

        const err = error instanceof Error ? error : new Error('Unknown error');
        this.logger.error(`가상 유저 예약 실패: ${err.message}`, err.stack);
        return;
      }
    }

    this.logger.warn(
      `가상 유저 예약 실패: user=${userId}, seat 선택 재시도 한도 초과`,
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async isVirtualUserEnabled(): Promise<boolean> {
    const raw = await this.redisService.hgetQueue(
      REDIS_KEYS.CONFIG_QUEUE,
      'virtual.enabled',
    );
    if (raw === null) {
      return true;
    }
    const lowered = raw.toLowerCase();
    return lowered !== '0' && lowered !== 'false' && lowered !== 'no';
  }

  private async getVirtualConfig() {
    const brpopTimeoutSeconds = await getTicketNumberField(
      this.redisService,
      'virtual.brpop_timeout_sec',
      2,
      { min: 1 },
    );
    const maxSeatPickAttempts = await getTicketNumberField(
      this.redisService,
      'virtual.max_seat_attempts',
      10,
      { min: 1 },
    );
    const errorDelayMs = await getTicketNumberField(
      this.redisService,
      'virtual.error_delay_ms',
      500,
      { min: 0 },
    );
    const processDelayMs = await getTicketNumberField(
      this.redisService,
      'virtual.process_delay_ms',
      0,
      { min: 0 },
    );

    return {
      brpopTimeoutSeconds,
      maxSeatPickAttempts,
      errorDelayMs,
      processDelayMs,
    };
  }
}
