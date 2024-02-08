import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn, Relation } from 'typeorm';
import { WorkflowProjectStatus } from './WorkflowProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['ToWorkflowId', 'ToStatusId'])
export class ProjectStatusTransition extends BaseEntity {
  // From Workflow Relation
  @PrimaryColumn({ name: 'FromWorkflowId', type: 'int' })
  @Index()
  FromWorkflowId: number;

  @ManyToOne(
    () => WorkflowProjectStatus,
    (WorkflowProjectStatus) => WorkflowProjectStatus.WorkflowId,
  )
  @JoinColumn({ name: 'FromWorkflowId' })
  FromWorkflow: Relation<WorkflowProjectStatus>;

  // From Status Relation
  @PrimaryColumn({ name: 'FromStatusId', type: 'int' })
  @Index()
  FromStatusId: number;

  @ManyToOne(() => WorkflowProjectStatus, (WorkflowProjectStatus) => WorkflowProjectStatus.StatusId)
  @JoinColumn({ name: 'FromStatusId' })
  FromStatus: Relation<WorkflowProjectStatus>;

  // To Workflow Relation
  @PrimaryColumn({ name: 'ToWorkflowId', type: 'int' })
  @Index()
  ToWorkflowId: number;

  @ManyToOne(
    () => WorkflowProjectStatus,
    (WorkflowProjectStatus) => WorkflowProjectStatus.WorkflowId,
  )
  @JoinColumn({ name: 'ToWorkflowId' })
  ToWorkflow: Relation<WorkflowProjectStatus>;

  // To Status Relation
  @PrimaryColumn({ name: 'ToStatusId', type: 'int' })
  @Index()
  ToStatusId: number;

  @ManyToOne(() => WorkflowProjectStatus, (WorkflowProjectStatus) => WorkflowProjectStatus.StatusId)
  @JoinColumn({ name: 'ToStatusId' })
  ToStatus: Relation<WorkflowProjectStatus>;

  @Column({ type: 'character varying', length: 100 })
  Action: string;

  @Column('boolean')
  ValidateTasks: boolean;
}
