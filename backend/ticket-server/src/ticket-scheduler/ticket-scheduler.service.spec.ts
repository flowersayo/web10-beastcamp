/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TicketSchedulerService } from './ticket-scheduler.service';
import { TicketSetupService } from '../ticket-setup/ticket-setup.service';
import { RedisService } from '../redis/redis.service';

describe('TicketSchedulerService', () => {
  let service: TicketSchedulerService;
  let setupService: jest.Mocked<TicketSetupService>;
  let redisService: jest.Mocked<RedisService>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TicketSchedulerService,
        {
          provide: TicketSetupService,
          useValue: {
            setup: jest.fn(),
            openTicketing: jest.fn(),
            tearDown: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            hget: jest.fn().mockResolvedValue(null),
            hset: jest.fn().mockResolvedValue(1),
            hsetnx: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<TicketSchedulerService>(TicketSchedulerService);
    setupService = module.get(TicketSetupService);
    redisService = module.get(RedisService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('onModuleInit', () => {
    it('기본 설정을 Redis에 시드해야 한다', async () => {
      jest.useFakeTimers();
      await service.onModuleInit();
      expect(jest.mocked(redisService.hsetnx)).toHaveBeenCalled();
      service.onModuleDestroy();
      jest.useRealTimers();
    });
  });

  describe('handleCycle', () => {
    it('전체 사이클(setup -> open -> close)이 순차적으로 실행되어야 한다', async () => {
      jest.useFakeTimers();

      const cyclePromise = service.handleCycle();

      expect(jest.mocked(setupService.setup)).toHaveBeenCalled();

      await Promise.resolve();

      await jest.advanceTimersByTimeAsync(60000);
      expect(jest.mocked(setupService.openTicketing)).toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(180000);
      expect(jest.mocked(setupService.tearDown)).toHaveBeenCalled();

      await cyclePromise;

      jest.useRealTimers();
    });

    it('중간에 에러 발생 시 tearDown을 호출해야 한다', async () => {
      jest.useFakeTimers();

      jest
        .mocked(setupService.setup)
        .mockRejectedValue(new Error('Setup Error'));

      const cyclePromise = service.handleCycle();

      await Promise.resolve();
      await Promise.resolve();

      expect(jest.mocked(setupService.tearDown)).toHaveBeenCalled();
      expect(jest.mocked(setupService.openTicketing)).not.toHaveBeenCalled();

      await cyclePromise;

      jest.useRealTimers();
    });
  });
});
