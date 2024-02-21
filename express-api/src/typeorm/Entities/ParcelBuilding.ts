import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Building } from '@/typeorm/Entities/Building';

@Entity()
export class ParcelBuilding extends BaseEntity {
  @PrimaryColumn({ name: 'parcel_id', type: 'int' })
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'parcel_id' })
  Parcel: Parcel;

  @PrimaryColumn({ name: 'building_id', type: 'int' })
  BuildingId: number;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'building_id' })
  Building: Building;
}
