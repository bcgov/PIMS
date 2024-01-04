import { Entity, PrimaryColumn, Column, Index, OneToMany } from 'typeorm';
import { AdministrativeAreas } from './AdministrativeAreas';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';

@Entity()
export class RegionalDistricts extends BaseEntity {
  @PrimaryColumn({ type: 'character varying', length: 4 })
  @Index({ unique: true })
  Id: string;

  @Column({ type: 'character varying', length: 250 })
  @Index({ unique: true })
  Name: string;

  @OneToMany(
    () => AdministrativeAreas,
    (AdministrativeAreas) => AdministrativeAreas.RegionalDistrict,
  )
  AdministrativeAreas: AdministrativeAreas[];
}
