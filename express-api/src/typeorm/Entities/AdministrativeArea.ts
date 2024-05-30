import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { RegionalDistrict } from './RegionalDistrict';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Province } from '@/typeorm/Entities/Province';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
@Unique('Unique_Name_RegionalDistrict', ['Name', 'RegionalDistrictId'])
export class AdministrativeArea extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  @Index()
  Name: string;

  @Column('boolean', { default: false })
  IsDisabled: boolean;

  @Column('int', { default: 0 })
  SortOrder: number;

  // Regional District Relations
  @Column({ name: 'regional_district_id', type: 'int' })
  @Index()
  RegionalDistrictId: number;

  @ManyToOne(() => RegionalDistrict, (RegionalDistrict) => RegionalDistrict.Id)
  @JoinColumn({ name: 'regional_district_id' })
  RegionalDistrict: RegionalDistrict;

  // Province Relations
  @Column({ name: 'province_id', type: 'character varying', length: 2 })
  @Index()
  ProvinceId: string;

  @ManyToOne(() => Province, (Province) => Province.Id)
  @JoinColumn({ name: 'province_id' })
  Province: Province;
}
