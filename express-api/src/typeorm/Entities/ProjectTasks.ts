//ProjectId can be included after the Projects entity is created

import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
//import { Projects } from './Projects';
import { Tasks } from './Tasks';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';

@Entity()
@Index([/*'ProjectId',*/ 'TaskId', 'IsCompleted', 'CompletedOn'])
export class ProjectTasks extends BaseEntity {
  @Column('bit')
  IsCompleted: boolean;

  @CreateDateColumn({ nullable: true })
  CompletedOn: Date;

  //@ManyToOne(() => Projects, (project) => project.Id)
  //@JoinColumn({ name: 'ProjectId' })
  //@PrimaryColumn()
  //ProjectId: Projects;

  @ManyToOne(() => Tasks, (task) => task.Id)
  @JoinColumn({ name: 'TaskId' })
  @PrimaryColumn()
  @Index()
  TaskId: Tasks;
}
