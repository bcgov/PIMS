import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class Workflow extends BaseEntity {
  @PrimaryColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('boolean')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column({ type: 'character varying', length: 20 })
  @Index({ unique: true })
  Code: string;

  @Column('text', { nullable: true })
  Description: string;
}
