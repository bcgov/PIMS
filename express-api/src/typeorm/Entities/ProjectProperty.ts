import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, Column } from 'typeorm';
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

  // Project Relation
  @Column({ name: 'ProjectId', type: 'int' })
  ProjectId: number;

  @ManyToOne(() => Project, (Project) => Project.Id)
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  // Property Type Relation
  @Column({ name: 'PropertyTypeId', type: 'int' })
  PropertyTypeId: number;

  @ManyToOne(() => PropertyType, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'PropertyTypeId' })
  PropertyType: PropertyType;

  // Parcel Relation
  @Column({ name: 'ParcelId', type: 'int', nullable: true })
  ParcelId: number;

  @ManyToOne(() => Parcel, (Parcel) => Parcel.Id)
  @JoinColumn({ name: 'ParcelId' })
  Parcel: Parcel;

  // Building Relation
  @Column({ name: 'BuildingId', type: 'int', nullable: true })
  BuildingId: number;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  Building: Building;
}
