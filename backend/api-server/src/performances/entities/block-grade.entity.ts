import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Performance } from './performance.entity';
import { Block } from '../../venues/entities/block.entity';
import { Grade } from './grade.entity';

@Entity('block_grades')
@Unique(['performanceId', 'blockId'])
export class BlockGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'performance_id' })
  performanceId: number;

  @Column({ name: 'block_id' })
  blockId: number;

  @Column({ name: 'grade_id' })
  gradeId: number;

  @ManyToOne(() => Performance)
  @JoinColumn({ name: 'performance_id' })
  performance: Performance;

  @ManyToOne(() => Block)
  @JoinColumn({ name: 'block_id' })
  block: Block;

  @ManyToOne(() => Grade)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;
}
