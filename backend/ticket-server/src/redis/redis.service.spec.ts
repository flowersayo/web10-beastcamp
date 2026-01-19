import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { PROVIDERS } from '@beastcamp/shared-constants';

describe('RedisService', () => {
  let service: RedisService;
  let mockRedis: Record<string, jest.Mock>;

  const mockRedisClient = {
    setnx: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    flushall: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: PROVIDERS.REDIS_TICKET,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    mockRedis = module.get(PROVIDERS.REDIS_TICKET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setNx (원자적 좌석 선점) 동작 테스트', () => {
    const key = 'session1_blockA_1_1';
    const userId = 'user123';

    describe('키가 존재하지 않는 경우 (첫 번째 예약 시도)', () => {
      beforeEach(() => {
        mockRedis.setnx.mockResolvedValue(1);
      });

      it('Redis에 값을 저장하고 true를 반환해야 한다', async () => {
        const result = await service.setNx(key, userId);
        expect(result).toBe(true);
        expect(mockRedis.setnx).toHaveBeenCalledWith(key, userId);
      });
    });

    describe('키가 이미 존재하는 경우 (중복 예약 시도)', () => {
      beforeEach(() => {
        mockRedis.setnx.mockResolvedValue(0);
      });

      it('값을 덮어쓰지 않고 false를 반환해야 한다', async () => {
        const result = await service.setNx(key, userId);
        expect(result).toBe(false);
      });
    });
  });

  describe('get 호출 시', () => {
    it('저장된 값을 반환해야 한다', async () => {
      mockRedis.get.mockResolvedValue('value');
      const result = await service.get('key');
      expect(result).toBe('value');
    });
  });

  describe('del 호출 시', () => {
    it('삭제된 키의 개수를 반환해야 한다', async () => {
      mockRedis.del.mockResolvedValue(1);
      const result = await service.del('key');
      expect(result).toBe(1);
    });
  });
});
