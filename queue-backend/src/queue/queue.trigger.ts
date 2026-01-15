import { PROVIDERS } from '@beastcamp/shared-constants';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { QueueWorker } from './queue.worker';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QueueTrigger implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueTrigger.name);
  private subClient: Redis;

  constructor(
    @Inject(PROVIDERS.REDIS_QUEUE) private readonly redis: Redis,
    private readonly worker: QueueWorker,
  ) {}

  async onModuleInit() {
    this.subClient = this.redis.duplicate();
    await this.subClient.subscribe('channel:finish');

    this.subClient.on('message', (channel) => {
      if (channel === 'channel:finish') {
        this.logger.log('🔔 작업 완료 메시지 수신 - 즉시 이동 시도');
        void this.worker.processQueueTransfer();
      }
    });
  }

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    await this.worker.processQueueTransfer();
  }

  async onModuleDestroy() {
    await this.subClient?.quit();
  }
}
