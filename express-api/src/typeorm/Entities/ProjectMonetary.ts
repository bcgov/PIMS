import { Entity, Index, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { Project } from './Project';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';
import { MonetaryType } from './MonetaryType';

@Entity()
@Index(['ProjectId', 'MonetaryTypeId'])
export class ProjectMonetary extends SoftDeleteEntity {
  // Project Relation
  @PrimaryColumn({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  // Task Relation
  @PrimaryColumn({ name: 'monetary_type_id', type: 'int' })
  @Index()
  MonetaryTypeId: number;

  @ManyToOne(() => MonetaryType, (Monetary) => Monetary.Id)
  @JoinColumn({ name: 'monetary_type_id' })
  MonetaryType: MonetaryType;

  @Column({ type: 'money' })
  Value: number;
}
