import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';
import { SoftDeleteEntity } from './abstractEntities/SoftDeleteEntity';
import { NoteType } from './NoteType';

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
  NoteTypeId: number;

  @ManyToOne(() => NoteType, (NoteType) => NoteType.Id)
  @JoinColumn({ name: 'note_type_id' })
  NoteType: NoteType;

  @Column('text')
  Note: string;
}
