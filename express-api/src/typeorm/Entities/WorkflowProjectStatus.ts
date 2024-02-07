import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Workflow } from '@/typeorm/Entities/Workflow';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['StatusId'])
export class WorkflowProjectStatus extends BaseEntity {
  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'WorkflowId' })
  @PrimaryColumn()
  WorkflowId: Workflow;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'StatusId' })
  @PrimaryColumn()
  StatusId: ProjectStatus;

  @Column('int')
  SortOrder: number;

  @Column('boolean')
  IsOptional: boolean;
}
