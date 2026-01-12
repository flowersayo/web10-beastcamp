import { Controller, Post, Body, Get } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueRequestDto } from './dto/create-venue-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetVenuesResponseDto } from './dto/get-venue-response.dto';

@ApiTags('공연장')
@Controller('api/venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @ApiOperation({ summary: '공연장 생성' })
  @ApiResponse({
    status: 201,
    description: '성공적으로 공연장이 생성됨',
    schema: { example: { id: 1 } },
  })
  async create(@Body() createVenueRequestDto: CreateVenueRequestDto) {
    return this.venuesService.create(createVenueRequestDto);
  }

  @Get()
  @ApiOperation({ summary: '공연장 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 목록을 조회함',
    type: GetVenuesResponseDto,
  })
  async findAll() {
    return this.venuesService.findAll();
  }
}
