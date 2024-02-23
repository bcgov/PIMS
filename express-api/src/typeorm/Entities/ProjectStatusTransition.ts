import { Entity, Column, Index, ManyToOne, JoinColumn, Relation, PrimaryColumn } from 'typeorm';
import { Workflow } from './Workflow';
import { ProjectStatus } from './ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['ToWorkflowId', 'ToStatusId'])
@Index(['FromWorkflowId', 'FromStatusId'])
export class ProjectStatusTransition extends BaseEntity {
  // From Workflow Relation
  @PrimaryColumn({ name: 'from_workflow_id', type: 'int' })
  FromWorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'from_workflow_id' })
  FromWorkflow: Relation<Workflow>;

  // From Status Relation
  @PrimaryColumn({ name: 'from_status_id', type: 'int' })
  FromStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'from_status_id' })
  FromStatus: Relation<ProjectStatus>;

  // To Workflow Relation
  @PrimaryColumn({ name: 'to_workflow_id', type: 'int' })
  ToWorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'to_workflow_id' })
  ToWorkflow: Relation<Workflow>;

  // To Status Relation
  @PrimaryColumn({ name: 'to_status_id', type: 'int' })
  ToStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'to_status_id' })
  ToStatus: Relation<ProjectStatus>;

  @Column({ type: 'character varying', length: 100 })
  Action: string;

  @Column('boolean')
  ValidateTasks: boolean;
}
