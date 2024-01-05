import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Code', 'Name', 'SortOrder'])
export class ProjectRisks extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column({ type: 'character varying', length: 10 })
  @Index({ unique: true })
  Code: string;

  @Column('text', { nullable: true })
  Description: string;
}
