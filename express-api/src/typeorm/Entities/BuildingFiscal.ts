import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Building } from '@/typeorm/Entities/Building';

@Entity()
export class BuildingFiscal extends Fiscal {
  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  @Index()
  BuildingId: Building;
}
