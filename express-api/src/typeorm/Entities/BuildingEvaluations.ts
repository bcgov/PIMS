import { Buildings } from '@/typeorm/Entities/Buildings';
import { Evaluation } from '@/typeorm/Entities/abstractEntities/Evaluation';
import { Entity, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['BuildingId', 'EvaluationKey'])
export class BuildingEvaluations extends Evaluation {
  @ManyToOne(() => Buildings, (Building) => Building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  BuildingId: Buildings;
}
