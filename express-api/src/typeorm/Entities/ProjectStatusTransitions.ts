import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { WorkflowProjectStatus } from './WorkflowProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['ToWorkflowId', 'ToStatusId'])
export class ProjectStatusTransitions extends BaseEntity {
  @ManyToOne(
    () => WorkflowProjectStatus,
    (WorkflowProjectStatus) => WorkflowProjectStatus.WorkflowId,
  )
  @JoinColumn({ name: 'FromWorkflowId' })
  @PrimaryColumn()
  @Index()
  FromWorkflowId: WorkflowProjectStatus;

  @ManyToOne(() => WorkflowProjectStatus, (WorkflowProjectStatus) => WorkflowProjectStatus.StatusId)
  @JoinColumn({ name: 'FromStatusId' })
  @PrimaryColumn()
  FromStatusId: WorkflowProjectStatus;

  @ManyToOne(
    () => WorkflowProjectStatus,
    (WorkflowProjectStatus) => WorkflowProjectStatus.WorkflowId,
  )
  @JoinColumn({ name: 'ToWorkflowId' })
  @PrimaryColumn()
  @Index()
  ToWorkflowId: WorkflowProjectStatus;

  @ManyToOne(() => WorkflowProjectStatus, (WorkflowProjectStatus) => WorkflowProjectStatus.StatusId)
  @JoinColumn({ name: 'ToStatusId' })
  @PrimaryColumn()
  ToStatusId: WorkflowProjectStatus;

  @Column({ type: 'character varying', length: 100 })
  Action: string;

  @Column('bit')
  ValidateTasks: boolean;
}
