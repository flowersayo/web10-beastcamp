import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { Block } from './entities/block.entity';
import { CreateVenueRequestDto } from './dto/create-venue-request.dto';
import { GetVenuesResponseDto } from './dto/get-venues-response.dto';
import { GetVenueResponseDto } from './dto/get-venue-response.dto';
import { CreateBlocksRequestDto } from './dto/create-blocks-request.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(Block)
    private blocksRepository: Repository<Block>,
  ) {}

  async create(requestDto: CreateVenueRequestDto): Promise<{ id: number }> {
    const venue = new Venue(requestDto.venue_name, requestDto.block_map_url);
    const savedVenue = await this.venuesRepository.save(venue);
    return { id: savedVenue.id };
  }

  async findAll(): Promise<GetVenuesResponseDto> {
    const venues = await this.venuesRepository.find();
    return GetVenuesResponseDto.fromEntities(venues);
  }

  async findOneWithBlocks(id: number): Promise<GetVenueResponseDto | null> {
    const venue = await this.venuesRepository.findOne({
      where: { id },
      relations: ['blocks'],
    });

    if (!venue) {
      return null;
    }

    return GetVenueResponseDto.fromEntity(venue);
  }

  async createBlocks(
    venueId: number,
    requestDto: CreateBlocksRequestDto,
  ): Promise<void> {
    const venue = await this.venuesRepository.findOne({
      where: { id: venueId },
    });

    if (!venue) {
      throw new BadRequestException('Invalid venue id');
    }

    const blocks = requestDto.blocks.map((dto) => {
      return new Block(venue, dto.blockDataName, dto.rowSize, dto.colSize);
    });

    await this.blocksRepository.save(blocks);
  }
}
