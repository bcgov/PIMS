import { Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fiscal } from '@/typeorm/Entities/abstractEntities/Fiscal';
import { Building } from '@/typeorm/Entities/Building';

@Entity()
export class BuildingFiscal extends Fiscal {
  @PrimaryColumn({ name: 'building_id', type: 'int' })
  @Index()
  BuildingId: number;

  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'building_id' })
  Building: Building;
}
