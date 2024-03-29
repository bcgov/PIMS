import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Province extends BaseEntity {
  @PrimaryColumn({ type: 'character varying', length: 2 })
  Id: string;

  @Column({ type: 'character varying', length: 100 })
  @Index({ unique: true })
  Name: string;
}
