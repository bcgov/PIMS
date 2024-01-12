import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'Code', 'SortOrder'])
export class ProjectStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column({ type: 'character varying', length: 10 })
  @Index({ unique: true })
  Code: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  GroupName: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsMilestone: boolean;

  @Column('bit')
  IsTerminal: boolean;

  @Column({ type: 'character varying', length: 150 })
  Route: boolean;
}
