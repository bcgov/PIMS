import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './abstractEntities/BaseEntity';
import { ProjectStatus } from './ProjectStatus';

@Entity()
export class MonetaryType extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;

  @Column('text', { nullable: true })
  Description: string;

  @Column('boolean')
  IsOptional: boolean;

  // Status Relation
  @Column({ name: 'status_id', type: 'int', nullable: true })
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id, { nullable: true })
  @JoinColumn({ name: 'status_id' })
  Status: ProjectStatus;
}
