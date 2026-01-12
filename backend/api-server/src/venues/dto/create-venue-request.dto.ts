import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueRequestDto {
  @ApiProperty({ description: '공연장 이름', example: '장충 체육관' })
  @IsString()
  @IsNotEmpty()
  venue_name: string;
}
