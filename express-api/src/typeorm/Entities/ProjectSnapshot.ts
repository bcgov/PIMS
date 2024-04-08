import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project, ProjectMetadata } from '@/typeorm/Entities/Project';

@Entity()
@Index(['ProjectId', 'SnapshotOn'])
export class ProjectSnapshot extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Project Relation
  @PrimaryColumn({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  @Index()
  Project: Project;

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

  @Column('jsonb', { nullable: true })
  Metadata: ProjectMetadata;
}
