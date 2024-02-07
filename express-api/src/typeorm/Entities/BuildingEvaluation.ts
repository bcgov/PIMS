import { Building } from '@/typeorm/Entities/Building';
import { Evaluation } from '@/typeorm/Entities/abstractEntities/Evaluation';
import { Entity, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['BuildingId', 'EvaluationKey'])
export class BuildingEvaluation extends Evaluation {
  @ManyToOne(() => Building, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  BuildingId: Building;
}
