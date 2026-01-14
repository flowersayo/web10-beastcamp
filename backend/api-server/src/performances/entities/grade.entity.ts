import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Performance } from './performance.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'performance_id' })
  performanceId: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => Performance, (performance) => performance.grades)
  @JoinColumn({ name: 'performance_id' })
  performance: Performance;
}
