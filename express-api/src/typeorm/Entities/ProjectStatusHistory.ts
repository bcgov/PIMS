import { Entity, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Project } from '@/typeorm/Entities/Project';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';

@Entity()
export class ProjectStatusHistory extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Project Relation
  @Column({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  @Index()
  Project: Project;

  // Status Relation
  @Column({ name: 'status_id', type: 'int' })
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id)
  @JoinColumn({ name: 'status_id' })
  @Index()
  Status: ProjectStatus;
}
