import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class ProjectTypes extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 20 })
  @Index({ unique: true })
  Name: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;
}
