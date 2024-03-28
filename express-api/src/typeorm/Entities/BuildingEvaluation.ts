import { Building } from '@/typeorm/Entities/Building';
import { Evaluation } from '@/typeorm/Entities/abstractEntities/Evaluation';
import { Entity, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['BuildingId', 'EvaluationKey', 'Year'], { unique: true })
export class BuildingEvaluation extends Evaluation {
  @PrimaryColumn({ name: 'building_id', type: 'int' })
  BuildingId: number;

  @ManyToOne(() => Building, (Building) => Building.Evaluations, { orphanedRowAction: 'disable' })
  @JoinColumn({ name: 'building_id' })
  Building: Building;
}
