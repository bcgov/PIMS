import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { Agency } from '@/typeorm/Entities/Agency';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { PropertyType } from '@/typeorm/Entities/PropertyType';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn, Point } from 'typeorm';

export abstract class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Description: string;

  @ManyToOne(() => PropertyClassification, (Classification) => Classification.Id)
  @JoinColumn({ name: 'ClassificationId' })
  @Index()
  ClassificationId: PropertyClassification;

  @ManyToOne(() => Agency, (Agency) => Agency.Id, { nullable: true })
  @JoinColumn({ name: 'AgencyId' })
  @Index()
  AgencyId: Agency;

  @ManyToOne(() => AdministrativeArea, (AdminArea) => AdminArea.Id)
  @JoinColumn({ name: 'AdministrativeAreaId' })
  @Index()
  AdministrativeAreaId: AdministrativeArea;

  @Column({ type: 'boolean' })
  IsSensitive: boolean;

  @Column({ type: 'boolean' })
  IsVisibleToOtherAgencies: boolean;

  @Column({ type: 'point' }) // We need PostGIS before we can use type geography, using point for now, but maybe this is ok?
  Location: Point; // May need a transformation here.

  @Column({ type: 'character varying', length: 2000, nullable: true })
  ProjectNumbers: string;

  @ManyToOne(() => PropertyType, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'PropertyTypeId' })
  @Index()
  PropertyTypeId: PropertyType;

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
