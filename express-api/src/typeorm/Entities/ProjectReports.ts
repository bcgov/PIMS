import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['Id', 'To', 'From', 'IsFinal'])
export class ProjectReports extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('bit')
  IsFinal: boolean;

  @Column({ type: 'character varying', length: 250, nullable: true })
  Name: string;

  @Column('timestamp')
  From: Date;

  @Column('timestamp')
  To: Date;

  @Column('int')
  ReportType: number;
}
