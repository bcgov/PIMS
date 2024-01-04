import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Workflows } from './Workflows';
import { ProjectStatus } from './ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';

@Entity()
@Index(['StatusId'])
export class WorkflowProjectStatus extends BaseEntity {
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
