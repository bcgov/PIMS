//ProjectId can be included after the Projects entity is created

import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Workflows } from '@/typeorm/Entities/Workflows';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Projects } from '@/typeorm/Entities/Projects';

@Entity()
export class ProjectStatusHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Projects, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn()
  @Index()
  ProjectId: Projects;

  @ManyToOne(() => Workflows, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'ToWorkflowId' })
  @PrimaryColumn()
  @Index()
  ToWorkflowId: Workflows;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'FromStatusId' })
  @PrimaryColumn()
  @Index()
  FromStatusId: ProjectStatus;
}
