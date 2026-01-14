import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BlockGrade } from './entities/block-grade.entity';

@Injectable()
export class BlockGradesRepository {
  constructor(
    @InjectRepository(BlockGrade)
    private readonly repository: Repository<BlockGrade>,
  ) {}

  async createMany(
    performanceId: number,
    mappings: { gradeId: number; blockId: number }[],
  ): Promise<BlockGrade[]> {
    const entities = mappings.map((m) =>
      this.repository.create({
        performanceId,
        gradeId: m.gradeId,
        blockId: m.blockId,
      }),
    );
    return this.repository.save(entities);
  }

  async findByPerformanceId(performanceId: number): Promise<BlockGrade[]> {
    return this.repository.find({
      where: { performanceId },
      relations: ['grade', 'block'],
    });
  }

  async findByPerformanceAndBlocks(
    performanceId: number,
    blockIds: number[],
  ): Promise<BlockGrade[]> {
    if (blockIds.length === 0) {
      return [];
    }
    return this.repository.find({
      where: {
        performanceId,
        blockId: In(blockIds),
      },
    });
  }
}
