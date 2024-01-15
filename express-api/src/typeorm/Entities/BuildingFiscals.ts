import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Buildings } from '@/typeorm/Entities/Buildings';

@Entity()
export class BuildingFiscals extends Fiscal {
  @ManyToOne(() => Buildings, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  @Index()
  BuildingId: Buildings;
}
