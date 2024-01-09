import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Buildings } from '@/typeorm/Entities/Buildings';

@Entity()
@Index(['BuildingId', 'FiscalYear', 'Key', 'Value'])
export class BuildingFiscals extends BaseEntity {
  @ManyToOne(() => Buildings, (building) => building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  BuildingId: Buildings;

  @PrimaryColumn('int')
  FiscalYear: number;

  @PrimaryColumn('int')
  Key: number;

  @Column('money')
  Value: boolean;

  @Column('text', { nullable: true })
  Note: string;

  @Column('timestamp', { nullable: true })
  EffectiveDate: Date;
}
