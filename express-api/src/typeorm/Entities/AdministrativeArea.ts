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

  @Column('boolean')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column({ type: 'character varying', length: 100, nullable: true })
  Abbreviation: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  BoundaryType: string;

  @ManyToOne(() => RegionalDistrict, (RegionalDistrict) => RegionalDistrict.Id)
  @JoinColumn({ name: 'RegionalDistrictId' })
  @Index()
  RegionalDistrictId: RegionalDistrict;

  @ManyToOne(() => Province, (Province) => Province.Id)
  @JoinColumn({ name: 'ProvinceId' })
  @Index()
  ProvinceId: Province;
}
