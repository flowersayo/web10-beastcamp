import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PerformanceApiService } from './performance-api.service';
import { AxiosTraceInterceptor } from '@beastcamp/shared-nestjs/trace/axios-trace.interceptor';
import { TraceModule } from '@beastcamp/shared-nestjs/trace/trace.module';

@Module({
  imports: [HttpModule, TraceModule],
  providers: [PerformanceApiService, AxiosTraceInterceptor],
  exports: [PerformanceApiService],
})
export class PerformanceApiModule {}
