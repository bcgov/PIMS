import { EvaluationKey } from '@/typeorm/Entities/EvaluationKey';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SoftDeleteEntity } from './SoftDeleteEntity';
import MoneyTransfomer from '@/typeorm/Transformers/MoneyTransformer';

@Entity()
export class Evaluation extends SoftDeleteEntity {
  @PrimaryColumn({ name: 'year', type: 'int' })
  Year: number;

  @PrimaryColumn({ name: 'evaluation_key_id', type: 'int' })
  EvaluationKeyId: number;

  @ManyToOne(() => EvaluationKey, (EvaluationKey) => EvaluationKey.Id)
  @JoinColumn({ name: 'evaluation_key_id' })
  EvaluationKey: EvaluationKey;

  @Column({
    type: 'money',
    transformer: MoneyTransfomer,
  })
  Value: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Note: string;
}
