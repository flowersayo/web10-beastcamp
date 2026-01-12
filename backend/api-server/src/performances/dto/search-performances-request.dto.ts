import { IsISO8601, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPerformancesRequestDto {
  @IsISO8601()
  @IsOptional()
  ticketing_after?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
