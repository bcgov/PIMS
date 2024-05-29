import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Property } from '@/typeorm/Entities/abstractEntities/Property';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';

@Entity()
@Index(['PID', 'PIN'], { unique: true })
export class Parcel extends Property {
  @Column({ type: 'real', nullable: true })
  LandArea: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  LandLegalDescription: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  Zoning: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  ZoningPotential: string;

  @Column({ name: 'parent_parcel_id', type: 'int', nullable: true })
  ParentParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'parent_parcel_id' })
  ParentParcel: Parcel;

  @OneToMany(() => ParcelFiscal, (Fiscal) => Fiscal.Parcel, { nullable: true, cascade: true })
  Fiscals: ParcelFiscal[];

  @OneToMany(() => ParcelEvaluation, (Evaluation) => Evaluation.Parcel, {
    nullable: true,
    cascade: true,
  })
  Evaluations: ParcelEvaluation[];
}
