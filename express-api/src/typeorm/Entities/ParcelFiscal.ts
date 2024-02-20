import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Parcel } from '@/typeorm/Entities/Parcel';

@Entity()
export class ParcelFiscal extends Fiscal {
  @PrimaryColumn({ name: 'parcel_id', type: 'int' })
  @Index()
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'parcel_id' })
  Parcel: Parcel;
}
