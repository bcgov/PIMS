import { FiscalKey } from '@/typeorm/Entities/FiscalKey';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@Index(['FiscalYear', 'FiscalKey', 'Value'])
export class Fiscal extends BaseEntity {
  @PrimaryColumn('int')
  FiscalYear: number;

  @PrimaryColumn()
  @ManyToOne(() => FiscalKey, (FiscalKey) => FiscalKey.Id)
  @JoinColumn({ name: 'FiscalKey' })
  FiscalKey: FiscalKey;

  @Column('money')
  Value: number;

  @Column('text', { nullable: true })
  Note: string;

  @Column('timestamp', { nullable: true })
  EffectiveDate: Date;
}
