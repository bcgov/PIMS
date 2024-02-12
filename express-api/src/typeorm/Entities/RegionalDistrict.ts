import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
export class RegionalDistrict extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  @Index({ unique: true })
  Id: number;

  @Column({ type: 'character varying', length: 5 })
  Abbreviation: string;

  @Column({ type: 'character varying', length: 250 })
  @Index({ unique: true })
  Name: string;
}
