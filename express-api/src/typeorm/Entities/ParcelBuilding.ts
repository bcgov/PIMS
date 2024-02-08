import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Building } from '@/typeorm/Entities/Building';

@Entity()
export class ParcelBuilding extends BaseEntity {
  @PrimaryColumn({ name: 'ParcelId', type: 'int' })
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  Parcel: Parcel;

  @PrimaryColumn({ name: 'BuildingId', type: 'int' })
  BuildingId: number;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  Building: Building;
}
