import { FiscalKey } from '@/typeorm/Entities/FiscalKey';
import { Entity, Column, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SoftDeleteEntity } from './SoftDeleteEntity';

@Entity()
@Index(['FiscalYear', 'FiscalKeyId', 'Value'])
export class Fiscal extends SoftDeleteEntity {
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
