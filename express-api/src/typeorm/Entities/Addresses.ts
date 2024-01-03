import { AdministrativeAreas } from '@/typeorm/Entities/AdministrativeAreas';
import { Provinces } from '@/typeorm/Entities/Provinces';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity()
@Unique('Unique Address', ['Address1', 'Province', 'Postal', 'AdministrativeArea'])
export class Addresses {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  CreatedById: string;

  @CreateDateColumn()
  CreatedOn: Date;

  @Column('uuid')
  UpdatedById: string;

  @Column('timestamp')
  UpdatedOn: Date;

  @Column({ type: 'character varying', length: 150 })
  Address1: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Address2: string;

  @ManyToOne(() => Provinces, (province) => province.Id)
  @JoinColumn({ name: 'Province' })
  Province: Provinces;

  @Column({ type: 'character varying', length: 6 })
  Postal: string;

  @ManyToOne(() => AdministrativeAreas, (adminArea) => adminArea.Id)
  @JoinColumn({ name: 'AdministrativeArea' })
  @Index()
  AdministrativeArea: number;
}
