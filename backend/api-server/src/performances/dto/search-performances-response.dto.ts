export class PerformanceDto {
  performance_id: number;
  performance_name: string;
  ticketing_date: string;
  performance_date: string;
  venue_id: number;
  venue_name: string;
}

export class SearchPerformancesResponseDto {
  performances: PerformanceDto[];
}
