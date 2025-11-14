import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FocusSession } from './FocusSession';
import { UserStats } from './UserStats';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: true })
  soundsEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FocusSession, (session) => session.user)
  focusSessions: FocusSession[];

  @OneToOne(() => UserStats, (stats) => stats.user)
  stats: UserStats;
}
