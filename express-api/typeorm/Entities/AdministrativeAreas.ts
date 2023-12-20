import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { RegionalDistrict } from './RegionalDistrict';

@Entity()
@Index(['IsDisabled', 'Name', 'SortOrder'])
export class AdministrativeAreas {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn('timestamp')
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn('timestamp')
  UpdatedOn: Date;

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

  @ManyToOne(() => RegionalDistrict, (RegionalDistrict) => RegionalDistrict.AdministrativeAreas, {
    cascade: true,
  })
  RegionalDistrict: RegionalDistrict;
}
