import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Parcel } from '@/typeorm/Entities/Parcel';

@Entity()
export class ParcelFiscal extends Fiscal {
  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn()
  @Index()
  ParcelId: Parcel;
}
