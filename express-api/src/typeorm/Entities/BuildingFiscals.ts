import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscals';
import { Buildings } from '@/typeorm/Entities/Buildings';

@Entity()
export class BuildingFiscals extends Fiscal {
  @ManyToOne(() => Buildings, (building) => building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  @Index()
  BuildingId: Buildings;
}
