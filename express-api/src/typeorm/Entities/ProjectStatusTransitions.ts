import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { Workflows } from './Workflows';

@Entity()
@Index(['ToWorkflowId', 'ToStatusId'])
export class ProjectStatusTransitions {
  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn()
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 100 })
  Action: string;

  @Column('bit')
  ValidateTasks: boolean;

  @ManyToOne(() => Workflows, (workflow) => workflow.Id)
  @JoinColumn({ name: 'FromWorkflowId' })
  @PrimaryColumn()
  @Index()
  FromWorkflowId: Workflows;

  @ManyToOne(() => Workflows, (workflow) => workflow.Id)
  @JoinColumn({ name: 'ToWorkflowId' })
  @PrimaryColumn()
  @Index()
  ToWorkflowId: Workflows;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  @PrimaryColumn()
  FromStatusId: ProjectStatus;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'ToStatusId' })
  @PrimaryColumn()
  @Index()
  ToStatusId: ProjectStatus;
}
