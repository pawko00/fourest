import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TreeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

@Entity('tree_types')
export class TreeType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TreeRarity,
    default: TreeRarity.COMMON,
  })
  rarity: TreeRarity;

  @Column({ type: 'int', default: 0 })
  unlockRequirement: number; // Number of trees needed to unlock

  @Column({ nullable: true })
  iconUrl?: string;

  @Column({ default: '#22c55e' })
  color: string;
}
