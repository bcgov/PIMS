import { FiscalKey } from '@/typeorm/Entities/FiscalKey';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@Index(['FiscalYear', 'FiscalKeyId', 'Value'])
export class Fiscal extends BaseEntity {
  @PrimaryColumn('int')
  FiscalYear: number;

  @PrimaryColumn({ name: 'fiscal_key_id', type: 'int' })
  FiscalKeyId: number;

  @ManyToOne(() => FiscalKey, (FiscalKey) => FiscalKey.Id)
  @JoinColumn({ name: 'fiscal_key_id' })
  FiscalKey: FiscalKey;

  @Column('money')
  Value: number;

  @Column('text', { nullable: true })
  Note: string;

  @Column('timestamp', { nullable: true })
  EffectiveDate: Date;
}
