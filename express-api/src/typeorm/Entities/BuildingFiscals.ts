import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscals } from '@/typeorm/Entities/abstractEntities/Fiscals';
import { Buildings } from '@/typeorm/Entities/Buildings';

@Entity()
export class BuildingFiscals extends Fiscals {
  @ManyToOne(() => Buildings, (building) => building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  @Index()
  BuildingId: Buildings;
}
