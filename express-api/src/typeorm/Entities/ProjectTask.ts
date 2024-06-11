import { Entity, Column, Index, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';

@Entity()
@Index(['ProjectId', 'TaskId', 'IsCompleted', 'CompletedOn'])
export class ProjectTask extends SoftDeleteEntity {
  // Project Relation
  @PrimaryColumn({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  // Task Relation
  @PrimaryColumn({ name: 'task_id', type: 'int' })
  @Index()
  TaskId: number;

  @ManyToOne(() => Task, (Task) => Task.Id)
  @JoinColumn({ name: 'task_id' })
  Task: Task;

  @Column('boolean')
  IsCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  CompletedOn: Date;
}
