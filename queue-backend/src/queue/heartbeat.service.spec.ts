import { PROVIDERS } from '@beastcamp/shared-constants';
import { Test, TestingModule } from '@nestjs/testing';
import { HeartbeatService } from './heartbeat.service';

describe('HeartbeatService', () => {
  let service: HeartbeatService;

  beforeEach(async () => {
    const redisMock = {
      zadd: jest.fn(),
      hget: jest.fn().mockResolvedValue(null),
      hsetnx: jest.fn().mockResolvedValue(1),
      hset: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeartbeatService,
        { provide: PROVIDERS.REDIS_QUEUE, useValue: redisMock },
      ],
    }).compile();

    service = module.get<HeartbeatService>(HeartbeatService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });
});
