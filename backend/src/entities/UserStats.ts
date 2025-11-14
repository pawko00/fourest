import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('user_stats')
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  userId: string;

  @Column({ type: 'int', default: 0 })
  totalSessions: number;

  @Column({ type: 'int', default: 0 })
  totalMinutes: number;

  @Column({ type: 'int', default: 0 })
  currentStreak: number;

  @Column({ type: 'int', default: 0 })
  longestStreak: number;

  @Column({ type: 'int', default: 0 })
  treesPlanted: number;

  @Column({ type: 'date', nullable: true })
  lastSessionDate?: Date;

  @Column({ type: 'jsonb', default: '[]' })
  unlockedTrees: string[];

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
