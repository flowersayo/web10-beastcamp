import { Controller, Post, Body } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueRequestDto } from './dto/create-venue-request.dto';

@Controller('api/venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  async create(@Body() createVenueRequestDto: CreateVenueRequestDto) {
    return this.venuesService.create(createVenueRequestDto);
  }
}
