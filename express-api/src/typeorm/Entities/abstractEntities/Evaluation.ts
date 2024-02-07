import { EvaluationKey } from '@/typeorm/Entities/EvaluationKey';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

export abstract class Evaluation extends BaseEntity {
  @PrimaryColumn('timestamp')
  Date: Date;

  @PrimaryColumn()
  @ManyToOne(() => EvaluationKey, (EvaluationKey) => EvaluationKey.Id)
  @JoinColumn({ name: 'EvaluationKey' })
  EvaluationKey: EvaluationKey;

  @Column({ type: 'money' })
  Value: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Note: string;
}
