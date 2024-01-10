import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Workflows } from '@/typeorm/Entities/Workflows';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['StatusId'])
export class WorkflowProjectStatus extends BaseEntity {
  @ManyToOne(() => Workflows, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'WorkflowId' })
  @PrimaryColumn()
  WorkflowId: Workflows;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'StatusId' })
  @PrimaryColumn()
  StatusId: ProjectStatus;

  @Column('int')
  SortOrder: number;

  @Column('bit')
  IsOptional: boolean;
}
