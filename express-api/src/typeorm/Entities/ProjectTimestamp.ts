import { Entity, CreateDateColumn, Index, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Project } from './Project';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';
import { TimestampType } from './TimestampType';

@Entity()
@Index(['ProjectId', 'TimestampTypeId'])
export class ProjectTimestamp extends SoftDeleteEntity {
  // Project Relation
  @PrimaryColumn({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  // Task Relation
  @PrimaryColumn({ name: 'timestamp_type_id', type: 'int' })
  @Index()
  TimestampTypeId: number;

  @ManyToOne(() => TimestampType, (Timestamp) => Timestamp.Id)
  @JoinColumn({ name: 'timestamp_type_id' })
  TimestampType: TimestampType;

  @CreateDateColumn()
  Value: Date;
}
