import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Parcels } from '@/typeorm/Entities/Parcels';
import { Buildings } from '@/typeorm/Entities/Buildings';

@Entity()
export class ParcelBuildings extends BaseEntity {
  @ManyToOne(() => Parcels, (parcel) => parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  @PrimaryColumn('int')
  ParcelId: Parcels;

  @ManyToOne(() => Buildings, (building) => building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn('int')
  BuildingId: Buildings;
}
