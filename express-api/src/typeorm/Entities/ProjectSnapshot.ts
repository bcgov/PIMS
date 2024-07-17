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
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';
import MoneyTransfomer from '../Transformers/MoneyTransformer';

@Entity()
@Index(['ProjectId', 'SnapshotOn'])
export class ProjectSnapshot extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Project Relation
  @PrimaryColumn({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  @Index()
  Project: Project;

  @Column('money', { nullable: true, transformer: MoneyTransfomer })
  NetBook: number;

  @Column('money', { nullable: true, transformer: MoneyTransfomer })
  Market: number;

  @Column('money', { nullable: true, transformer: MoneyTransfomer })
  Assessed: number;

  @Column('money', { nullable: true, transformer: MoneyTransfomer })
  Appraised: number;

  @Column('timestamp')
  SnapshotOn: Date;

  @Column('jsonb', { nullable: true })
  Metadata: ProjectMetadata;
}
