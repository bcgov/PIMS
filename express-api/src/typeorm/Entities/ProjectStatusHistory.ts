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

  // Project Relation
  @PrimaryColumn({ name: 'ProjectId', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @Index()
  Project: Project;

  // Workflow Relation
  @PrimaryColumn({ name: 'WorkflowId', type: 'int' })
  WorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'WorkflowId' })
  @Index()
  Workflow: Workflow;

  // Status Relation
  @PrimaryColumn({ name: 'StatusId', type: 'int' })
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'StatusId' })
  @Index()
  Status: ProjectStatus;
}
