import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Projects } from '@/typeorm/Entities/Projects';
import { Buildings } from '@/typeorm/Entities/Buildings';
import { Parcels } from '@/typeorm/Entities/Parcels';
import { PropertyTypes } from './PropertyTypes';

@Entity()
@Index(['ProjectId', 'PropertyType', 'ParcelId', 'BuildingId'])
export class ProjectProperties extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Projects, (project) => project.Id)
  @JoinColumn({ name: 'ProjectId' })
  ProjectId: Projects;

  @ManyToOne(() => PropertyTypes, (propertyType) => propertyType.Id)
  @JoinColumn({ name: 'PropertyType' })
  PropertyType: number;

  @ManyToOne(() => Parcels, (parcel) => parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  ParcelId: Parcels;

  @ManyToOne(() => Buildings, (building) => building.Id)
  @JoinColumn({ name: 'BuildingId' })
  BuildingId: Buildings;
}
