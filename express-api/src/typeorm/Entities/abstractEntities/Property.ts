import { Addresses } from '@/typeorm/Entities/Addresses';
import { PropertyClassifications } from '@/typeorm/Entities/PropertyClassifications';
import { PropertyTypes } from '@/typeorm/Entities/PropertyTypes';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn, Point } from 'typeorm';
import { Agencies } from '../Agencies';

export abstract class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column({ type: 'character varying', length: 2000, nullable: true })
  Description: string;

  @ManyToOne(() => PropertyClassifications, (Classification) => Classification.Id)
  @JoinColumn({ name: 'ClassificationId' })
  @Index()
  ClassificationId: PropertyClassifications;

  @ManyToOne(() => Agencies, (Agency) => Agency.Id, { nullable: true })
  @JoinColumn({ name: 'AgencyId' })
  @Index()
  AgencyId: Agencies;

  @ManyToOne(() => Addresses, (Address) => Address.Id)
  @JoinColumn({ name: 'AddressId' })
  @Index()
  AddressId: Addresses;

  @Column({ type: 'bit' })
  IsSensitive: boolean;

  @Column({ type: 'bit' })
  IsVisibleToOtherAgencies: boolean;

  @Column({ type: 'point' }) // We need PostGIS before we can use type geography, using point for now, but maybe this is ok?
  Location: Point; // May need a transformation here.

  @Column({ type: 'character varying', length: 2000, nullable: true })
  ProjectNumbers: string;

  @ManyToOne(() => PropertyTypes, (PropertyType) => PropertyType.Id)
  @JoinColumn({ name: 'PropertyTypeId' })
  @Index()
  PropertyTypeId: PropertyTypes;
}
