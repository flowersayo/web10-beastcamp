import { Injectable, Logger } from '@nestjs/common';
import { PerformanceApiService } from '../performance-api/performance-api.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    private readonly performanceApi: PerformanceApiService,
    private readonly redisService: RedisService,
  ) {}

  async setup(): Promise<void> {
    // 최신 공연 목록 조회.
    const performances = await this.performanceApi.getPerformances(1);
    if (performances.length === 0) {
      throw new Error('No performances found');
    }
    const performanceId = performances[0].performance_id;
    this.logger.log(`Starting setup for performance: ${performanceId}`);

    // 세션 목록 조회.
    const sessions = await this.performanceApi.getSessions(performanceId);

    // 중복 제거된 Venue ID 목록 추출.
    const venueIds = [...new Set(sessions.map((session) => session.venueId))];

    // 각 공연장 정보 조회.
    const venues = await Promise.all(
      venueIds.map((id) => this.performanceApi.getVenueWithBlocks(id)),
    );

    // Redis에 저장 테스크.
    const redisTasks = venues.flatMap((venue) =>
      venue.blocks.map((block) => {
        const key = `venue:${venue.id}_block:${block.id}`;
        const data = JSON.stringify({
          rowSize: block.rowSize,
          colSize: block.colSize,
        });
        return this.redisService.set(key, data);
      }),
    );

    // Redis 저장 실행.
    await Promise.all(redisTasks);

    this.logger.log(`Setup completed for performance: ${performanceId}`);
  }
}
