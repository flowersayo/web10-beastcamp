import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueRequestDto } from './dto/create-venue-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetVenuesResponseDto } from './dto/get-venues-response.dto';
import { GetVenueResponseDto } from './dto/get-venue-response.dto';

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

  @Get(':id')
  @ApiOperation({ summary: '공연장 상세 조회 (구역 포함)' })
  @ApiResponse({
    status: 200,
    description:
      '성공적으로 공연장 정보를 조회함 (존재하지 않으면 빈 객체 반환)',
    type: GetVenueResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const venue = await this.venuesService.findOneWithBlocks(id);
    return venue || {};
  }
}
