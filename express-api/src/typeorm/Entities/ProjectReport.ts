import { ReportType } from '@/typeorm/Entities/ReportType';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
@Index(['Id', 'To', 'From', 'IsFinal'])
export class ProjectReport extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('boolean')
  IsFinal: boolean;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column({ type: 'timestamp', nullable: true })
  From: Date;

  @Column('timestamp')
  To: Date;

  // Report Type Relation
  @Column({ name: 'ReportTypeId', type: 'int' })
  ReportTypeId: number;

  @ManyToOne(() => ReportType, (ReportType) => ReportType.Id)
  @JoinColumn({ name: 'ReportTypeId' })
  ReportType: ReportType;
}
