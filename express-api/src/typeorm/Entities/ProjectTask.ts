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
  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn()
  ProjectId: Project;

  @ManyToOne(() => Task, (Task) => Task.Id)
  @JoinColumn({ name: 'TaskId' })
  @PrimaryColumn()
  @Index()
  TaskId: Task;

  @Column('boolean')
  IsCompleted: boolean;

  @CreateDateColumn({ nullable: true })
  CompletedOn: Date;
}
