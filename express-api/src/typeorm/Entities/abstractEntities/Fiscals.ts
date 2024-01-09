import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['FiscalYear', 'Key', 'Value'])
export class Fiscal extends BaseEntity {
  @PrimaryColumn('int')
  FiscalYear: number;

  @PrimaryColumn('int')
  Key: number;

  @Column('money')
  Value: number;

  @Column('text', { nullable: true })
  Note: string;

  @Column('timestamp', { nullable: true })
  EffectiveDate: Date;
}
