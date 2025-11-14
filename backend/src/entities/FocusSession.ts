import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { TreeType } from './TreeType';

@Entity('focus_sessions')
export class FocusSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ nullable: true })
  treeTypeId?: string;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt?: Date;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => User, (user) => user.focusSessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TreeType, { nullable: true })
  @JoinColumn({ name: 'treeTypeId' })
  treeType?: TreeType;
}
