import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvaluationKey extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('text', { nullable: true })
  Description: string;
}
