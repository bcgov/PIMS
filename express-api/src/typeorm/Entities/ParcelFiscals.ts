import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Parcels } from '@/typeorm/Entities/Parcels';

@Entity()
export class ParcelFiscals extends Fiscal {
  @ManyToOne(() => Parcels, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn()
  @Index()
  ParcelId: Parcels;
}
