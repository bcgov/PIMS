import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Workflows } from './Workflows';
import { ProjectStatus } from './ProjectStatus';

@Entity()
@Index(['StatusId'])
export class WorkflowProjectStatus {
  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn()
  UpdatedOn: Date;

  @Column('int')
  SortOrder: number;

  @Column('bit')
  IsOptional: boolean;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'StatusId' })
  @PrimaryColumn()
  StatusId: ProjectStatus;

  @ManyToOne(() => Workflows, (Workflows) => Workflows.Id)
  @JoinColumn({ name: 'WorkflowId' })
  @PrimaryColumn()
  WorkflowId: Workflows;
}
