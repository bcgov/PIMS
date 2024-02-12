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
  @PrimaryColumn({ name: 'ProjectId', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  // Task Relation
  @PrimaryColumn({ name: 'TaskId', type: 'int' })
  @Index()
  TaskId: number;

  @ManyToOne(() => Task, (Task) => Task.Id)
  @JoinColumn({ name: 'TaskId' })
  Task: Task;

  @Column('boolean')
  IsCompleted: boolean;

  @CreateDateColumn({ nullable: true })
  CompletedOn: Date;
}
