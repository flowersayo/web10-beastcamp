import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionRequestDto {
  @ApiProperty({
    description: '공연 회차 일시 (ISO 8601)',
    example: '2026-01-14T19:00:00Z',
  })
  @IsISO8601()
  @IsNotEmpty()
  sessionDate: string;

  @ApiProperty({ description: '공연장 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  venue_id: number;
}
