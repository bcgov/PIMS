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

  @ManyToOne(() => Projects, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  ProjectId: Projects;

  @ManyToOne(() => PropertyTypes, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'PropertyType' })
  PropertyType: number;

  @ManyToOne(() => Parcels, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  ParcelId: Parcels;

  @ManyToOne(() => Buildings, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  BuildingId: Buildings;
}
