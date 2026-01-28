import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { KopisService } from '../kopis/kopis.service';
import { DataSource } from 'typeorm';
import { Performance } from '../performances/entities/performance.entity';
import { Session } from '../performances/entities/session.entity';
import { Venue } from '../venues/entities/venue.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const kopisService = app.get(KopisService);
  const dataSource = app.get(DataSource);

  // Repository 가져오기
  const performanceRepository = dataSource.getRepository(Performance);
  const sessionRepository = dataSource.getRepository(Session);
  const venueRepository = dataSource.getRepository(Venue);

  try {
    console.log('Fetching KOPIS data...');

    // Venue 목록 가져오기 (랜덤 할당용)
    const venues = await venueRepository.find();

    const performances = await kopisService.getPerformancesFromKopis();

    // 먼저 모든 상세 정보를 비동기로 가져옴
    const detailPromises = performances.map(async (performance) => {
      const detail = await kopisService.getPerformanceDetailsFromKopis(
        performance.mt20id,
      );
      return detail;
    });
    const details = await Promise.all(detailPromises);
    const validDetails = details.filter((detail) => detail !== null);

    console.log(`Found ${validDetails.length} valid performances`);

    let performanceCount = 0;
    let sessionCount = 0;

    // Performance와 Session 생성
    for (const detail of validDetails) {
      // Performance 엔티티 생성 및 저장
      const performanceEntity = kopisService.toPerformanceEntity(detail);
      console.log(performanceEntity);
      const savedPerformance =
        await performanceRepository.save(performanceEntity);
      performanceCount++;

      // Session 일정 파싱
      const sessionDates = kopisService.parseSessionDates(detail);

      // 랜덤 Venue 선택
      const randomVenue = venues[Math.floor(Math.random() * venues.length)];

      // Session 생성 및 저장
      for (const sessionDate of sessionDates) {
        const session = new Session(
          savedPerformance.id,
          sessionDate,
          randomVenue.id,
        );
        console.log(session);
        await sessionRepository.save(session);
        sessionCount++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total Performances: ${performanceCount}`);
    console.log(`Total Sessions: ${sessionCount}`);
  } catch (error) {
    console.error('KOPIS data sync failed:');
    console.error(error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await app.close();
  }
}

void bootstrap();
