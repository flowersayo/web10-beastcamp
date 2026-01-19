import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { ReservationService } from './reservation.service';
import { RedisService } from '../redis/redis.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';

jest.mock('cron');

describe('TaskService', () => {
  let service: TaskService;

  const mockReservationService = { setup: jest.fn() };
  const mockRedisService = { set: jest.fn() };
  const mockSchedulerRegistry = { addCronJob: jest.fn() };
  const mockConfigService = {
    get: jest.fn(<T>(key: string, defaultValue: T): T => defaultValue),
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: ReservationService, useValue: mockReservationService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: SchedulerRegistry, useValue: mockSchedulerRegistry },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('onModuleInit 호출 시', () => {
    it('CronJob을 등록하고 시작해야 한다', () => {
      const mockJob = { start: jest.fn() };
      (CronJob as unknown as jest.Mock).mockReturnValue(mockJob);

      service.onModuleInit();

      expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'setupJob',
        mockJob,
      );
      expect(mockJob.start).toHaveBeenCalled();
    });
  });

  describe('handleSetup 호출 시', () => {
    describe('성공하면', () => {
      beforeEach(() => {
        mockReservationService.setup.mockResolvedValue(undefined);
        mockRedisService.set.mockResolvedValue('OK');
      });

      it('일정 시간 후 티켓팅을 오픈하고, 이후 tearDown을 예약해야 한다', async () => {
        await service.handleSetup();

        expect(mockReservationService.setup).toHaveBeenCalled();

        // 1분(60000ms) 후: 티켓팅 오픈
        jest.advanceTimersByTime(60000);
        await Promise.resolve();
        expect(mockRedisService.set).toHaveBeenCalledWith(
          'is_ticketing_open',
          'true',
        );

        // 3분(180000ms) 후: 티켓팅 마감
        jest.advanceTimersByTime(180000);
        await Promise.resolve();
        expect(mockRedisService.set).toHaveBeenCalledWith(
          'is_ticketing_open',
          'false',
        );
      });
    });

    describe('실패하면', () => {
      it('티켓팅을 닫아야 한다', async () => {
        mockReservationService.setup.mockRejectedValue(
          new Error('Setup Error'),
        );
        await service.handleSetup();

        expect(mockRedisService.set).toHaveBeenCalledWith(
          'is_ticketing_open',
          'false',
        );
      });
    });
  });
});
