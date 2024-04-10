import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, Column } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Project } from '@/typeorm/Entities/Project';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { PropertyType } from './PropertyType';

@Entity()
@Index(['ProjectId', 'PropertyType', 'ParcelId', 'BuildingId'], { unique: true })
export class ProjectProperty extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  // Project Relation
  @Column({ name: 'project_id', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'project_id' })
  Project: Project;

  // Property Type Relation
  @Column({ name: 'property_type_id', type: 'int' })
  PropertyTypeId: number;

  @ManyToOne(() => PropertyType, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'property_type_id' })
  PropertyType: PropertyType;

  // Parcel Relation
  @Column({ name: 'parcel_id', type: 'int', nullable: true })
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'parcel_id' })
  Parcel: Parcel;

  // Building Relation
  @Column({ name: 'building_id', type: 'int', nullable: true })
  BuildingId: number;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'building_id' })
  Building: Building;
}
