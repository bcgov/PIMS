import { Parcel } from '@/typeorm/Entities/Parcel';
import { Evaluation } from '@/typeorm/Entities/abstractEntities/Evaluation';
import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['ParcelId', 'EvaluationKey'])
export class ParcelEvaluation extends Evaluation {
  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn()
  ParcelId: Parcel;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Firm: string;
}
