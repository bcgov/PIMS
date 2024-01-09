import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscals';
import { Parcels } from '@/typeorm/Entities/Parcels';

@Entity()
export class ParcelFiscals extends Fiscal {
  @ManyToOne(() => Parcels, (parcel) => parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn()
  @Index()
  ParcelId: Parcels;
}
