import { IsISO8601, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionRequestDto {
  @ApiProperty({
    description: '공연 회차 일시 (ISO 8601)',
    example: '2026-01-14T19:00:00Z',
  })
  @IsISO8601()
  @IsNotEmpty()
  sessionDate: string;
}
