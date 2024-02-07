import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Workflow } from '@/typeorm/Entities/Workflow';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Project } from '@/typeorm/Entities/Project';

@Entity()
export class ProjectStatusHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn()
  @Index()
  ProjectId: Project;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'WorkflowId' })
  @PrimaryColumn()
  @Index()
  WorkflowId: Workflow;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'StatusId' })
  @PrimaryColumn()
  @Index()
  StatusId: ProjectStatus;
}
