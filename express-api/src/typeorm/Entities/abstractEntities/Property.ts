import { AdministrativeAreas } from '@/typeorm/Entities/AdministrativeAreas';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { PropertyClassifications } from '@/typeorm/Entities/PropertyClassifications';
import { PropertyTypes } from '@/typeorm/Entities/PropertyTypes';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn, Point } from 'typeorm';

export abstract class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Description: string;

  @ManyToOne(() => PropertyClassifications, (Classification) => Classification.Id)
  @JoinColumn({ name: 'Classification' })
  @Index()
  Classification: PropertyClassifications;

  @ManyToOne(() => Agencies, (Agency) => Agency.Id, { nullable: true })
  @JoinColumn({ name: 'Agency' })
  @Index()
  Agency: Agencies;

  @ManyToOne(() => AdministrativeAreas, (AdminArea) => AdminArea.Id)
  @JoinColumn({ name: 'AdministrativeArea' })
  @Index()
  AdministrativeArea: AdministrativeAreas;

  @Column({ type: 'bit' })
  IsSensitive: boolean;

  @Column({ type: 'bit' })
  IsVisibleToOtherAgencies: boolean;

  @Column({ type: 'point' }) // We need PostGIS before we can use type geography, using point for now, but maybe this is ok?
  Location: Point; // May need a transformation here.

  @Column({ type: 'character varying', length: 2000, nullable: true })
  ProjectNumbers: string;

  @ManyToOne(() => PropertyTypes, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'PropertyType' })
  @Index()
  PropertyType: PropertyTypes;

  @Column({ type: 'character varying', length: 150, nullable: true })
  @Index()
  Address1: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Address2: string;

  @Column({ type: 'character varying', length: 6, nullable: true })
  Postal: string;

  // Including this for quick geocoder lookup.
  @Column({ type: 'character varying', nullable: true })
  SiteId: string;
}
