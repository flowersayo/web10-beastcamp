import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { Venue } from './entities/venue.entity';
import { Block } from './entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Block])],
  controllers: [VenuesController],
  providers: [VenuesService],
})
export class VenuesModule {}
