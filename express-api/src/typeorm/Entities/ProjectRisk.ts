import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Code', 'Name', 'SortOrder'])
export class ProjectRisk extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Name: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;

  @Column({ type: 'character varying', length: 10 })
  @Index({ unique: true })
  Code: string;

  @Column('text', { nullable: true })
  Description: string;
}
