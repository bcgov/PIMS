import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Subdivision extends BaseEntity {
  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParentId' })
  @PrimaryColumn('int')
  ParentId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'SubdivisionId' })
  @PrimaryColumn('int')
  SubdivisionId: number;
}
