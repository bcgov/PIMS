import { Parcels } from '@/typeorm/Entities/Parcels';
import { Evaluation } from '@/typeorm/Entities/abstractEntities/Evaluation';
import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['ParcelId', 'EvaluationKey'])
export class ParcelEvaluations extends Evaluation {
  @ManyToOne(() => Parcels, (parcel) => parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn()
  ParcelId: Parcels;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Firm: string;
}
