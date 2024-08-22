import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { Agency } from '@/typeorm/Entities/Agency';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { PropertyType } from '@/typeorm/Entities/PropertyType';
import { Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SoftDeleteEntity } from './SoftDeleteEntity';

// Custom type to easily handle points without PostGIS
export type GeoPoint = {
  x: number;
  y: number;
};

export abstract class Property extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Description: string;

  // Classification Relations
  @Column({ name: 'classification_id', type: 'int' })
  ClassificationId: number;

  @ManyToOne(() => PropertyClassification, (Classification) => Classification.Id)
  @JoinColumn({ name: 'classification_id' })
  @Index()
  Classification: PropertyClassification;

  // Agency Relations
  @Column({ name: 'agency_id', type: 'int', nullable: true })
  AgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id, { nullable: true })
  @JoinColumn({ name: 'agency_id' })
  @Index()
  Agency: Agency;

  // Administrative Area Relations
  @Column({ name: 'administrative_area_id', type: 'int' })
  AdministrativeAreaId: number;

  @ManyToOne(() => AdministrativeArea, (AdminArea) => AdminArea.Id)
  @JoinColumn({ name: 'administrative_area_id' })
  @Index()
  AdministrativeArea: AdministrativeArea;

  @Column({ type: 'boolean' })
  IsSensitive: boolean;

  @Column({ type: 'boolean' })
  IsVisibleToOtherAgencies: boolean;

  @Column({
    type: 'point',
    transformer: {
      to: (obj: GeoPoint) => `${obj.x},${obj.y}`, // Going to the database. Format into point.
      from: (value: GeoPoint) => value, // Coming from the database. Comes out formatted!
    },
  })
  Location: GeoPoint;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  ProjectNumbers: string;

  // Property Type Relations
  @Column({ name: 'property_type_id', type: 'int' })
  PropertyTypeId: number;

  @ManyToOne(() => PropertyType, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'property_type_id' })
  @Index()
  PropertyType: PropertyType;

  @Column({ type: 'character varying', length: 150, nullable: true })
  @Index()
  Address1: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Address2: string;

  @Column({ type: 'character varying', length: 6, nullable: true })
  Postal: string;

  @Column({ type: 'int', nullable: true })
  PID: number;

  @Column({ type: 'int', nullable: true })
  PIN: number;
}
