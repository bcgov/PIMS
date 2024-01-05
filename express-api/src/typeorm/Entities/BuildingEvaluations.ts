import { Buildings } from '@/typeorm/Entities/Buildings';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['BuildingId', 'EvaluationKey'])
export class BuildingEvaluations extends BaseEntity {
  @ManyToOne(() => Buildings, (building) => building.Id)
  @JoinColumn({ name: 'BuildingId' })
  @PrimaryColumn()
  BuildingId: Buildings;

  @PrimaryColumn('timestamp')
  Date: Date;

  @PrimaryColumn('int')
  EvaluationKey: number;

  @Column({ type: 'money' })
  Value: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Note: string;
}
