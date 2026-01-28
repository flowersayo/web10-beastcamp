import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_KEYS } from '@beastcamp/shared-constants';
import { RedisService } from '../redis/redis.service';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class VirtualUserWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(VirtualUserWorker.name);
  private readonly brpopTimeoutSeconds = 2;
  private readonly maxSeatPickAttempts = 10;
  private isRunning = false;

  constructor(
    private readonly redisService: RedisService,
    private readonly reservationService: ReservationService,
  ) {}

  onModuleInit() {
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
          await this.delay(500);
          continue;
        }

        const result = await this.redisService.brpopQueueList(
          REDIS_KEYS.VIRTUAL_ACTIVE_QUEUE,
          this.brpopTimeoutSeconds,
        );

        if (!this.isRunning) {
          return;
        }

        if (!result) {
          continue;
        }

        const [, userId] = result;
        await this.processVirtualUser(userId);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        this.logger.error(
          `가상 유저 처리 루프 오류: ${err.message}`,
          err.stack,
        );
        await this.delay(500);
      }
    }
  }

  private async processVirtualUser(userId: string): Promise<void> {
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

    for (let attempt = 0; attempt < this.maxSeatPickAttempts; attempt++) {
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
    const raw = await this.redisService.get('queue:virtual:enabled');
    if (raw === null) {
      return true;
    }
    return raw !== '0' && raw.toLowerCase() !== 'false';
  }
}
