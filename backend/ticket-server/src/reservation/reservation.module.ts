import { Module } from '@nestjs/common';
import { PerformanceApiModule } from '../performance-api/performance-api.module';
import { RedisModule } from '../redis/redis.module';
import { ReservationService } from './reservation.service';
import { TaskService } from './task.service';

@Module({
  imports: [PerformanceApiModule, RedisModule],
  providers: [ReservationService, TaskService],
  exports: [ReservationService],
})
export class ReservationModule {}
