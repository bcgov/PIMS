import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Workflow } from '@/typeorm/Entities/Workflow';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
export class WorkflowProjectStatus extends BaseEntity {
  // Workflow Relation
  @PrimaryColumn({ name: 'workflow_id', type: 'int' })
  @Index()
  WorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'workflow_id' })
  Workflow: Workflow;

  // Status Relation
  @PrimaryColumn({ name: 'status_id', type: 'int' })
  @Index()
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'status_id' })
  Status: ProjectStatus;

  @Column('int', { default: 0 })
  SortOrder: number;

  @Column('boolean')
  IsOptional: boolean;
}
