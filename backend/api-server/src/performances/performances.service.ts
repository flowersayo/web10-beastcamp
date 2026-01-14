import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { CreatePerformanceRequestDto } from './dto/create-performance-request.dto';
import { Venue } from '../venues/entities/venue.entity';
import { SearchPerformancesRequestDto } from './dto/search-performances-request.dto';
import { SearchPerformancesResponseDto } from './dto/search-performances-response.dto';
import { PerformancesRepository } from './performances.repository';
import { CreateSessionRequestDto } from './dto/create-session-request.dto';
import { GetSessionsResponseDto } from './dto/get-sessions-response.dto';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './sessions.repository';

@Injectable()
export class PerformancesService {
  constructor(
    private performancesRepository: PerformancesRepository,
    private sessionsRepository: SessionsRepository,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(
    requestDto: CreatePerformanceRequestDto,
  ): Promise<{ id: number }> {
    // validate venue id
    const venue = await this.venuesRepository.findOne({
      where: { id: requestDto.venue_id },
    });
    if (!venue) {
      throw new BadRequestException('Invalid venue id');
    }

    const performance = new Performance(
      requestDto.performance_name,
      new Date(requestDto.ticketing_date),
      requestDto.venue_id,
    );
    const savedPerformance =
      await this.performancesRepository.save(performance);
    return { id: savedPerformance.id };
  }

  async search(
    requestDto: SearchPerformancesRequestDto,
  ): Promise<SearchPerformancesResponseDto> {
    const performances = await this.performancesRepository.search(requestDto);

    return SearchPerformancesResponseDto.fromEntities(performances);
  }

  async createSession(
    performanceId: number,
    requestDto: CreateSessionRequestDto,
  ): Promise<{ id: number }> {
    const performance = await this.performancesRepository.findOne({
      where: { id: performanceId },
    });
    if (!performance) {
      throw new BadRequestException('Invalid performance id');
    }

    const session = new Session(
      performanceId,
      new Date(requestDto.sessionDate),
    );
    const savedSession = await this.sessionsRepository.save(session);
    return { id: savedSession.id };
  }

  async getSessions(performanceId: number): Promise<GetSessionsResponseDto[]> {
    const sessions =
      await this.sessionsRepository.findByPerformanceId(performanceId);
    return GetSessionsResponseDto.fromEntities(sessions);
  }
}
