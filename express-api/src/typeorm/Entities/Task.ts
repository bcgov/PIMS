import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['IsDisabled', 'IsOptional', 'Name', 'SortOrder'])
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;

  @Column('text', { nullable: true })
  Description: string;

  @Column('boolean')
  IsOptional: boolean;

  // Status Relation
  @Column({ name: 'status_id', type: 'int' })
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id, { nullable: true })
  @JoinColumn({ name: 'status_id' })
  Status: ProjectStatus;
}
