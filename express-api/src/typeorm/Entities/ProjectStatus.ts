import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'Code', 'SortOrder'])
export class ProjectStatus extends BaseEntity {
  @PrimaryColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;

  @Column({ type: 'character varying', length: 10 })
  @Index({ unique: true })
  Code: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  GroupName: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('boolean')
  IsMilestone: boolean;

  @Column('boolean')
  IsTerminal: boolean;

  @Column({ type: 'character varying', length: 150 })
  Route: string;
}
