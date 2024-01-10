import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Projects } from '@/typeorm/Entities/Projects';

@Entity()
@Index(['ProjectId', 'NoteType'])
export class ProjectNotes extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Projects, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  ProjectId: Projects;

  @Column('int')
  NoteType: number;

  @Column('text')
  Note: string;
}
