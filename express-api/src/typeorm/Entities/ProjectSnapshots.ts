import {
  Entity,
  Column,
  CreateDateColumn,
  Index /*
  ManyToOne,
  JoinColumn,
  PrimaryColumn,*/,
  PrimaryGeneratedColumn,
} from 'typeorm';
//import { Projects } from './Projects';

@Entity()
@Index([/*'ProjectId',*/ 'SnapshotOn'])
export class ProjectSnapshots {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn()
  UpdatedOn: Date;

  @Column('money', { nullable: true })
  NetBook: number;

  @Column('money', { nullable: true })
  Market: number;

  @Column('money', { nullable: true })
  Assessed: number;

  @Column('money', { nullable: true })
  Appraised: number;

  @Column('timestamp')
  SnapshotOn: Date;

  @Column('text', { nullable: true })
  Metadata: string;

  /*@ManyToOne(() => Projects, (project) => project.Id)
  @JoinColumn({ name: 'ProjectId' })
  @PrimaryColumn()
  @Index()
  ProjectId: Projects;*/
}
