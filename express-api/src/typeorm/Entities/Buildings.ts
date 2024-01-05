import { Addresses } from '@/typeorm/Entities/Addresses';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
import { BuildingConstructionTypes } from '@/typeorm/Entities/BuildingConstructionTypes';
import { BuildingOccupantTypes } from '@/typeorm/Entities/BuildingOccupantTypes';
import { BuildingPredominateUses } from '@/typeorm/Entities/BuildingPredominateUses';
import { PropertyClassifications } from '@/typeorm/Entities/PropertyClassifications';
import { PropertyTypes } from '@/typeorm/Entities/PropertyTypes';
import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  Point,
} from 'typeorm';

// Should the occupant information (OccupantTypeId, OccupantName, and BuildingTenancyUpdatedOn) be a separate table?
// This may change over time and we wouldn't be able to track previous occupants by storing it in this table.

// Can Buildings and Parcels share a base Properties entity?
@Entity()
export class Buildings extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Description: string;

  @ManyToOne(() => PropertyClassifications, (classification) => classification.Id)
  @JoinColumn({ name: 'ClassificationId' })
  @Index()
  ClassificationId: PropertyClassifications;

  @ManyToOne(() => Agencies, (agency) => agency.Id, { nullable: true })
  @JoinColumn({ name: 'AgencyId' })
  @Index()
  AgencyId: Agencies;

  @ManyToOne(() => Addresses, (address) => address.Id)
  @JoinColumn({ name: 'AddressId' })
  @Index()
  AddressId: Addresses;

  @Column({ type: 'bit' })
  IsSensitive: boolean;

  @Column({ type: 'bit' })
  IsVisibleToOtherAgencies: boolean;

  @ManyToOne(() => BuildingConstructionTypes, (constructionType) => constructionType.Id)
  @JoinColumn({ name: 'BuildingConstructionTypeId' })
  @Index()
  BuildingConstructionTypeId: BuildingConstructionTypes;

  @Column({ type: 'int' })
  BuildingFloorCount: number;

  @ManyToOne(() => BuildingPredominateUses, (predominateUse) => predominateUse.Id)
  @JoinColumn({ name: 'BuildingPredominateUseId' })
  @Index()
  BuildingPredominateUseId: BuildingPredominateUses;

  @Column({ type: 'character varying', length: 450 })
  BuildingTenancy: string;

  @Column({ type: 'real' })
  RentableArea: number;

  @ManyToOne(() => BuildingOccupantTypes, (occupantType) => occupantType.Id)
  @JoinColumn({ name: 'BuildingOccupantTypeId' })
  @Index()
  BuildingOccupantTypeId: BuildingOccupantTypes;

  @Column({ type: 'timestamp', nullable: true })
  LeaseExpiry: Date;

  @Column({ type: 'character varying', length: 100, nullable: true })
  OccupantName: string;

  @Column({ type: 'bit' })
  TransferLeaseOnSale: boolean;

  @Column({ type: 'point' }) // We need PostGIS before we can use type geography, using point for now, but maybe this is ok?
  Location: Point; // May need a transformation here.

  @Column({ type: 'timestamp', nullable: true })
  BuildingTenancyUpdatedOn: Date;

  @Column({ type: 'character varying', length: 500, nullable: true })
  EncumbranceReason: string;

  // What is this column used for?
  @Column({ type: 'character varying', length: 2000, nullable: true })
  LeasedLandMetadata: string;

  @Column({ type: 'real' })
  TotalArea: number;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  ProjectNumbers: string;

  @ManyToOne(() => PropertyTypes, (propertyType) => propertyType.Id)
  @JoinColumn({ name: 'PropertyTypeId' })
  @Index()
  PropertyTypeId: PropertyTypes;
}
