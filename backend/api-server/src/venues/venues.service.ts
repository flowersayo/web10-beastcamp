import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { CreateVenueRequestDto } from './dto/create-venue-request.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(
    createVenueRequestDto: CreateVenueRequestDto,
  ): Promise<{ id: number }> {
    const venue = this.venuesRepository.create({
      venueName: createVenueRequestDto.venue_name,
    });
    const savedVenue = await this.venuesRepository.save(venue);
    return { id: savedVenue.id };
  }
}
