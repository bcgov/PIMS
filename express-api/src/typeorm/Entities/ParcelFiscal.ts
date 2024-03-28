import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Parcel } from '@/typeorm/Entities/Parcel';

@Entity()
@Index(['ParcelId', 'FiscalKeyId', 'FiscalYear'], { unique: true })
export class ParcelFiscal extends Fiscal {
  @PrimaryColumn({ name: 'parcel_id', type: 'int' })
  @Index()
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Fiscals, { orphanedRowAction: 'disable' })
  @JoinColumn({ name: 'parcel_id' })
  Parcel: Parcel;
}
