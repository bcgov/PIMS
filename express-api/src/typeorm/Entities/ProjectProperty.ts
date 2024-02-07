import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Project } from '@/typeorm/Entities/Project';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { PropertyType } from './PropertyType';

@Entity()
@Index(['ProjectId', 'PropertyType', 'ParcelId', 'BuildingId'])
export class ProjectProperty extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  ProjectId: Project;

  @ManyToOne(() => PropertyType, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'PropertyType' })
  PropertyType: PropertyType;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  ParcelId: Parcel;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  BuildingId: Building;
}
