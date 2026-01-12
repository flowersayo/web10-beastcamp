import { Performance } from '../entities/performance.entity';

export class PerformanceDto {
  performance_id: number;
  performance_name: string;
  ticketing_date: string;
  performance_date: string;
  venue_id: number;
  venue_name: string;

  static fromEntity(performance: Performance): PerformanceDto {
    const dto = new PerformanceDto();
    dto.performance_id = performance.id;
    dto.performance_name = performance.performanceName;
    dto.ticketing_date = performance.ticketingDate.toISOString();
    dto.performance_date = performance.performanceDate.toISOString();
    dto.venue_id = performance.venueId;
    dto.venue_name = performance.venue.venueName;
    return dto;
  }
}

export class SearchPerformancesResponseDto {
  performances: PerformanceDto[];

  static fromEntities(
    performances: Performance[],
  ): SearchPerformancesResponseDto {
    const dto = new SearchPerformancesResponseDto();
    dto.performances = performances.map((performance) =>
      PerformanceDto.fromEntity(performance),
    );
    return dto;
  }
}
