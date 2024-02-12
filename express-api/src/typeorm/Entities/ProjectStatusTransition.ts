import { Entity, Column, Index, ManyToOne, JoinColumn, Relation, PrimaryColumn } from 'typeorm';
import { Workflow } from './Workflow';
import { ProjectStatus } from './ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['ToWorkflowId', 'ToStatusId'])
@Index(['FromWorkflowId', 'FromStatusId'])
export class ProjectStatusTransition extends BaseEntity {
  // From Workflow Relation
  @PrimaryColumn({ name: 'FromWorkflowId', type: 'int' })
  FromWorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'FromWorkflowId' })
  FromWorkflow: Relation<Workflow>;

  // From Status Relation
  @PrimaryColumn({ name: 'FromStatusId', type: 'int' })
  FromStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  FromStatus: Relation<ProjectStatus>;

  // To Workflow Relation
  @PrimaryColumn({ name: 'ToWorkflowId', type: 'int' })
  ToWorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'ToWorkflowId' })
  ToWorkflow: Relation<Workflow>;

  // To Status Relation
  @PrimaryColumn({ name: 'ToStatusId', type: 'int' })
  ToStatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'ToStatusId' })
  ToStatus: Relation<ProjectStatus>;

  @Column({ type: 'character varying', length: 100 })
  Action: string;

  @Column('boolean')
  ValidateTasks: boolean;
}
