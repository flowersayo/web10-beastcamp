import { Venue } from '../entities/venue.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VenueDto {
  @ApiProperty({ description: '공연장 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '공연장 이름', example: '장충 체육관' })
  venue_name: string;

  static fromEntity(venue: Venue): VenueDto {
    const dto = new VenueDto();
    dto.id = venue.id;
    dto.venue_name = venue.venueName;
    return dto;
  }
}

export class GetVenuesResponseDto {
  @ApiProperty({ type: [VenueDto], description: '공연장 목록' })
  venues: VenueDto[];

  static fromEntities(venues: Venue[]): GetVenuesResponseDto {
    const dto = new GetVenuesResponseDto();
    dto.venues = venues.map((venue) => VenueDto.fromEntity(venue));
    return dto;
  }
}
