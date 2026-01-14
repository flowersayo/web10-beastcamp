import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { CreatePerformanceRequestDto } from './dto/create-performance-request.dto';
import { SearchPerformancesRequestDto } from './dto/search-performances-request.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SearchPerformancesResponseDto } from './dto/search-performances-response.dto';
import { CreateSessionRequestDto } from './dto/create-session-request.dto';
import { GetSessionsResponseDto } from './dto/get-sessions-response.dto';
import { CreateGradeRequestDto } from './dto/create-grade-request.dto';
import { GetGradeResponseDto } from './dto/get-grade-response.dto';
import { CreateBlockGradeRequestDto } from './dto/create-block-grade-request.dto';
import { GetBlockGradeResponseDto } from './dto/get-block-grade-response.dto';

@ApiTags('공연')
@Controller('api/performances')
@ApiExtraModels(GetSessionsResponseDto)
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Post()
  @ApiOperation({ summary: '공연 생성' })
  @ApiResponse({
    status: 201,
    description: '성공적으로 공연이 생성됨',
    schema: { example: { id: 1 } },
  })
  async create(
    @Body() createPerformanceRequestDto: CreatePerformanceRequestDto,
  ) {
    return this.performancesService.create(createPerformanceRequestDto);
  }

  @Get()
  @ApiOperation({ summary: '최신 공연 목록 조회' })
  @ApiResponse({
    status: 200,
    type: SearchPerformancesResponseDto,
    description: '성공적으로 목록을 조회함',
  })
  async search(
    @Query() searchPerformancesRequestDto: SearchPerformancesRequestDto,
  ) {
    return this.performancesService.search(searchPerformancesRequestDto);
  }

  @Post(':id/sessions')
  @ApiOperation({ summary: '공연 회차 생성' })
  @ApiParam({ name: 'id', description: '공연 ID', example: 1 })
  @ApiResponse({
    status: 201,
    description: '성공적으로 회차가 생성됨',
    schema: { example: { id: 1 } },
  })
  async createSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() createSessionRequestDto: CreateSessionRequestDto,
  ): Promise<{ id: number }> {
    return this.performancesService.createSession(id, createSessionRequestDto);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: '공연 회차 조회' })
  @ApiParam({ name: 'id', description: '공연 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '성공적으로 회차 목록을 조회함',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(GetSessionsResponseDto) },
      example: [
        {
          id: 1,
          performanceId: 1,
          sessionDate: '2026-01-14T14:00:00Z',
        },
        {
          id: 2,
          performanceId: 1,
          sessionDate: '2026-01-14T19:00:00Z',
        },
      ],
    },
  })
  async getSessions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetSessionsResponseDto[]> {
    return this.performancesService.getSessions(id);
  }

  @Post(':id/grades')
  @ApiOperation({ summary: '공연 등급 생성' })
  @ApiParam({ name: 'id', description: '공연 ID', example: 1 })
  @ApiBody({
    type: [CreateGradeRequestDto],
    description: '공연 등급 목록',
    examples: {
      '등급 목록': {
        value: [
          { name: 'VIP', price: 150000 },
          { name: 'R', price: 120000 },
          { name: 'S', price: 90000 },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '성공적으로 등급이 생성됨',
  })
  async createGrades(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDtos: CreateGradeRequestDto[],
  ): Promise<void> {
    return this.performancesService.createGrades(id, requestDtos);
  }

  @Get(':id/grades')
  @ApiOperation({ summary: '공연 등급 조회' })
  @ApiParam({ name: 'id', description: '공연 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '성공적으로 등급 목록을 조회함',
    type: [GetGradeResponseDto],
  })
  async getGrades(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetGradeResponseDto[]> {
    return this.performancesService.getGrades(id);
  }

  @Post(':id/block-grades')
  @ApiOperation({ summary: '공연 구역 등급 할당' })
  @ApiParam({ name: 'id', description: '공연 ID', example: 1 })
  @ApiBody({
    type: [CreateBlockGradeRequestDto],
    description: '구역별 등급 할당 목록',
    examples: {
      '할당 목록': {
        value: [
          { gradeId: 1, blockIds: [101, 102] },
          { gradeId: 2, blockIds: [103, 104] },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '성공적으로 등급이 할당됨',
  })
  @ApiResponse({
    status: 400,
    description: '이미 할당된 구역이 포함되어 있음',
  })
  async createBlockGrades(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDtos: CreateBlockGradeRequestDto[],
  ): Promise<void> {
    return this.performancesService.createBlockGrades(id, requestDtos);
  }

  @Get(':id/block-grades')
  @ApiOperation({ summary: '공연 구역 등급 매핑 조회' })
  @ApiParam({ name: 'id', description: '공연 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '성공적으로 구역별 등급 매핑을 조회함',
    type: [GetBlockGradeResponseDto],
  })
  async getBlockGrades(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetBlockGradeResponseDto[]> {
    return this.performancesService.getBlockGrades(id);
  }
}
