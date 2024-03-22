import { Parcel } from '@/typeorm/Entities/Parcel';
import { Evaluation } from '@/typeorm/Entities/abstractEntities/Evaluation';
import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['ParcelId', 'EvaluationKey', 'Year'], { unique: true })
export class ParcelEvaluation extends Evaluation {
  @PrimaryColumn({ name: 'parcel_id', type: 'int' })
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Evaluations, { orphanedRowAction: 'disable' })
  @JoinColumn({ name: 'parcel_id' })
  Parcel: Parcel;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Firm: string;
}
