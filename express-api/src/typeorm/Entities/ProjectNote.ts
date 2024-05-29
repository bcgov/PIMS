import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';

@Entity()
@Index(['ProjectId', 'NoteType'], { unique: true })
export class ProjectNote extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Project Relation
  @Column({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  @Column('int')
  NoteType: number;

  @Column('text')
  Note: string;
}
