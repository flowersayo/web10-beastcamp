import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { CreatePerformanceRequestDto } from './dto/create-performance-request.dto';
import { SearchPerformancesRequestDto } from './dto/search-performances-request.dto';

@Controller('api/performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Post()
  async create(
    @Body() createPerformanceRequestDto: CreatePerformanceRequestDto,
  ) {
    return this.performancesService.create(createPerformanceRequestDto);
  }

  @Get()
  async search(
    @Query() searchPerformancesRequestDto: SearchPerformancesRequestDto,
  ) {
    return this.performancesService.search(searchPerformancesRequestDto);
  }
}
