import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { Workflows } from './Workflows';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['ToWorkflowId', 'ToStatusId'])
export class ProjectStatusTransitions extends BaseEntity {
  @ManyToOne(() => Workflows, (workflow) => workflow.Id)
  @JoinColumn({ name: 'FromWorkflowId' })
  @PrimaryColumn()
  @Index()
  FromWorkflowId: Workflows;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  @PrimaryColumn()
  FromStatusId: ProjectStatus;

  @ManyToOne(() => Workflows, (workflow) => workflow.Id)
  @JoinColumn({ name: 'ToWorkflowId' })
  @PrimaryColumn()
  @Index()
  ToWorkflowId: Workflows;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'ToStatusId' })
  @PrimaryColumn()
  @Index()
  ToStatusId: ProjectStatus;

  @Column({ type: 'character varying', length: 100 })
  Action: string;

  @Column('bit')
  ValidateTasks: boolean;
}
