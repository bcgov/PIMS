import { AdministrativeAreas } from '@/typeorm/Entities/AdministrativeAreas';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Provinces } from '@/typeorm/Entities/Provinces';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity()
@Unique('Unique Address', ['Address1', 'Province', 'Postal', 'AdministrativeArea'])
export class Addresses extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 150 })
  Address1: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Address2: string;

  @ManyToOne(() => Provinces, (Province) => Province.Id)
  @JoinColumn({ name: 'Province' })
  Province: Provinces;

  @Column({ type: 'character varying', length: 6 })
  Postal: string;

  @ManyToOne(() => AdministrativeAreas, (AdminArea) => AdminArea.Id)
  @JoinColumn({ name: 'AdministrativeArea' })
  @Index()
  AdministrativeArea: number;
}
