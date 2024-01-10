import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';

@Entity()
export class RegionalDistricts extends BaseEntity {
  @PrimaryColumn({ type: 'character varying', length: 4 })
  @Index({ unique: true })
  Id: string;

  @Column({ type: 'character varying', length: 250 })
  @Index({ unique: true })
  Name: string;
}
