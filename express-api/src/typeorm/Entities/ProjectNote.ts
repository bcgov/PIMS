import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '@/typeorm/Entities/Project';

@Entity()
@Index(['ProjectId', 'NoteType'])
export class ProjectNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Project Relation
  @Column({ name: 'ProjectId', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  @Column('int')
  NoteType: number;

  @Column('text')
  Note: string;
}
