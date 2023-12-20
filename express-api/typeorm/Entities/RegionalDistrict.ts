import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, OneToMany } from 'typeorm';
import { AdministrativeAreas } from './AdministrativeAreas';

@Entity()
export class RegionalDistrict {
  @PrimaryColumn({ type: 'character varying', length: 4 })
  @Index({ unique: true })
  Id: string;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn('timestamp')
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @CreateDateColumn('timestamp')
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 250 })
  @Index({ unique: true })
  Name: string;

  @OneToMany(
    () => AdministrativeAreas,
    (AdministrativeAreas) => AdministrativeAreas.RegionalDistrict,
  )
  AdministrativeAreas: AdministrativeAreas[];
}
