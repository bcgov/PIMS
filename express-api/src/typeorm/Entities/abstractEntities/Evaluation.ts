import { BaseEntity } from "@/typeorm/Entities/abstractEntities/BaseEntity";
import { Column, PrimaryColumn } from "typeorm";

export abstract class Evaluation extends BaseEntity {
  @PrimaryColumn('timestamp')
  Date: Date;

  @PrimaryColumn('int')
  EvaluationKey: number;

  @Column({ type: 'money' })
  Value: number;

  @Column({ type: 'character varying', length: 500, nullable: true })
  Note: string;
}
