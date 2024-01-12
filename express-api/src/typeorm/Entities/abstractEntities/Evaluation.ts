import { EvaluationKeys } from '@/typeorm/Entities/EvaluationKeys';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

export abstract class Evaluation extends BaseEntity {
  @PrimaryColumn('timestamp')
  Date: Date;

  @PrimaryColumn()
  @ManyToOne(() => EvaluationKeys, (EvaluationKey) => EvaluationKey.Id)
  @JoinColumn({ name: 'EvaluationKey' })
  EvaluationKey: EvaluationKeys;

  @Column({ type: 'money' })
  Value: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Note: string;
}
