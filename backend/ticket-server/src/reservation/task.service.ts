import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { ReservationService } from './reservation.service';
import { RedisService } from './../redis/redis.service';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);
  private readonly ticketingDuration: number;
  private readonly setupInterval: string;

  constructor(
    private readonly reservationService: ReservationService,
    private readonly redisService: RedisService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
  ) {
    this.ticketingDuration = parseInt(
      this.configService.get('TICKETING_DURATION', '180000'),
      10,
    );
    this.setupInterval = this.configService.get(
      'SETUP_INTERVAL',
      '0 */5 * * * *',
    );
  }

  onModuleInit() {
    const job = new CronJob(this.setupInterval, () => {
      void this.handleSetup();
    });

    // cron 패키지 버전 불일치로 인한 타입 오류를 방지하기 위해 any 캐스팅 사용
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.schedulerRegistry.addCronJob('setupJob', job as any);
    job.start();
  }

  async handleSetup() {
    try {
      // set-up 과정.
      await this.reservationService.setup();

      // 티켓팅 open.
      await this.redisService.set('is_ticketing_open', 'true');

      // tear-down 예약.
      setTimeout(() => {
        void this.tearDown();
      }, this.ticketingDuration);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Setup failed: ${err.message}`, err.stack);
      await this.redisService.set('is_ticketing_open', 'false');
    }
  }

  async tearDown() {
    try {
      await this.redisService.set('is_ticketing_open', 'false');
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Tear-down failed: ${err.message}`, err.stack);
    }
  }
}
