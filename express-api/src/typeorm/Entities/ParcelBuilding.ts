import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Building } from '@/typeorm/Entities/Building';

@Entity()
export class ParcelBuilding extends BaseEntity {
  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn('int')
  ParcelId: Parcel;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn('int')
  BuildingId: Building;
}
