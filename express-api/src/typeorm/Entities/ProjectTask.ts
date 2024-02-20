import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['ProjectId', 'TaskId', 'IsCompleted', 'CompletedOn'])
export class ProjectTask extends BaseEntity {
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

  @CreateDateColumn({ nullable: true })
  CompletedOn: Date;
}
