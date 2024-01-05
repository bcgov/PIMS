import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';

@Entity()
@Index(['IsDisabled', 'IsOptional', 'Name', 'SortOrder'])
export class Tasks extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsOptional: boolean;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id, { nullable: true })
  @JoinColumn({ name: 'StatusId' })
  StatusId: ProjectStatus;
}
