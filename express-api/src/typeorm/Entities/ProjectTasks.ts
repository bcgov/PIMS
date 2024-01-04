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

@Entity()
@Index([/*'ProjectId',*/ 'TaskId', 'IsCompleted', 'CompletedOn'])
export class ProjectTasks {
  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn()
  UpdatedOn: Date;

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
  TaskId: Tasks;
}
