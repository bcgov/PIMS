import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'Code', 'SortOrder'])
export class ProjectStatus {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn('timestamp')
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn('timestamp')
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column({ type: 'character varying', length: 10 })
  @Index({ unique: true })
  Code: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  GroupName: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('bit')
  IsMilestone: boolean;

  @Column('bit')
  IsTerminal: boolean;

  @Column({ type: 'character varying', length: 150 })
  Route: boolean;
}
