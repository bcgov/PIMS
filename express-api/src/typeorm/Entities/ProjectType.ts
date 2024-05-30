import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class ProjectType extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 20 })
  @Index({ unique: true })
  Name: string;

  @Column('text', { nullable: true })
  Description: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;
}
