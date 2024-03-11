import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from '@/typeorm/Entities/abstractEntities/Property';

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

  @Column({ type: 'boolean' })
  NotOwned: boolean;

  @Column({ name: 'parent_parcel_id', type: 'int', nullable: true })
  ParentParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'parent_parcel_id' })
  ParentParcel: Parcel;
}
