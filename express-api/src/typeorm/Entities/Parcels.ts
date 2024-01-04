import { Addresses } from '@/typeorm/Entities/Addresses';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';
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

@Entity()
@Index(['PID', 'PIN'], { unique: true })
export class Parcels extends BaseEntity {
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

  @Column({ type: 'int' })
  PID: number;

  @Column({ type: 'int', nullable: true })
  PIN: number;

  @Column({ type: 'real', nullable: true })
  LandArea: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  LandLegalDescription: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  Zoning: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  ZoningPotential: string;

  @Column({ type: 'bit' })
  NotOwned: boolean;

  @Column({ type: 'point' }) // We need PostGIS before we can use type geography, using point for now, but maybe this is ok?
  Location: Point; // May need a transformation here.

  @Column({ type: 'character varying', length: 500, nullable: true })
  EncumbranceReason: string;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  ProjectNumbers: string;

  @ManyToOne(() => PropertyTypes, (propertyType) => propertyType.Id)
  @JoinColumn({ name: 'PropertyTypeId' })
  @Index()
  PropertyTypeId: PropertyTypes;
}
