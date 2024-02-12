import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Workflow } from '@/typeorm/Entities/Workflow';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
export class WorkflowProjectStatus extends BaseEntity {
  // Workflow Relation
  @PrimaryColumn({ name: 'WorkflowId', type: 'int' })
  @Index()
  WorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'WorkflowId' })
  Workflow: Workflow;

  // Status Relation
  @PrimaryColumn({ name: 'StatusId', type: 'int' })
  @Index()
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'StatusId' })
  Status: ProjectStatus;

  @Column('int')
  SortOrder: number;

  @Column('boolean')
  IsOptional: boolean;
}
