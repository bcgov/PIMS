import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectStatus } from './ProjectStatus';

@Entity()
@Index(['IsDisabled', 'IsOptional', 'Name', 'SortOrder'])
export class Tasks {
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

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsOptional: boolean;

  @ManyToOne(() => ProjectStatus, (ProjectStatus) => ProjectStatus.Id, { nullable: true })
  @JoinColumn({ name: 'StatusId' })
  StatusId: ProjectStatus;
}
