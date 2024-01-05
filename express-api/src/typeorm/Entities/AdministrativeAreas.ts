import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from 'typeorm';
import { RegionalDistricts } from './RegionalDistricts';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class AdministrativeAreas extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  @Index({ unique: true })
  Name: string;

  @Column('bit')
  IsDisabled: boolean;

  @Column('int')
  SortOrder: number;

  @Column({ type: 'character varying', length: 100, nullable: true })
  Abbreviation: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  BoundaryType: string;

  @ManyToOne(() => RegionalDistricts, (RegionalDistrict) => RegionalDistrict.AdministrativeAreas)
  RegionalDistrict: RegionalDistricts;
}
