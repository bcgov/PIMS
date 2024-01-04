//ProjectId can be included after the Projects entity is created

import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { Workflows } from './Workflows';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
//import { Projects } from './Projects';

@Entity()
export class ProjectStatusHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  /* @ManyToOne(() => Projects, (project) => project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn()
  @Index()
  ProjectId: Projects; */

  @ManyToOne(() => Workflows, (workflow) => workflow.Id)
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
