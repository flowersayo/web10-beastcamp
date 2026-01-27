import { Module } from '@nestjs/common';
import { ReservationModule } from '../reservation/reservation.module';
import { VirtualUserWorker } from './virtual-user.worker';

@Module({
  imports: [ReservationModule],
  providers: [VirtualUserWorker],
})
export class VirtualUserModule {}
