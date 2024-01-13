import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Parcels } from '@/typeorm/Entities/Parcels';
import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Subdivisions extends BaseEntity {
  @ManyToOne(() => Parcels, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParentId' })
  @PrimaryColumn('int')
  ParentId: number;

  @ManyToOne(() => Parcels, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'SubdivisionId' })
  @PrimaryColumn('int')
  SubdivisionId: number;
}
