import { Entity, Column, Index, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Workflow } from '@/typeorm/Entities/Workflow';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { ProjectRisk } from '@/typeorm/Entities/ProjectRisk';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Agency } from './Agency';

@Entity()
@Index(['Assessed', 'NetBook', 'Market', 'ReportedFiscalYear', 'ActualFiscalYear'])
@Index(['StatusId', 'TierLevelId', 'AgencyId'])
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'character varying', length: 25 })
  @Index({ unique: true })
  ProjectNumber: string;

  @Column({ type: 'character varying', length: 100 })
  Name: string;

  @Column({ type: 'character varying', length: 150, nullable: true })
  Manager: string;

  @Column('int')
  ReportedFiscalYear: number;

  @Column('int')
  ActualFiscalYear: number;

  @Column('text', { nullable: true })
  Description: string;

  @Column('text', { nullable: true })
  Metadata: string;

  @Column('timestamp', { nullable: true })
  SubmittedOn: Date;

  @Column('timestamp', { nullable: true })
  ApprovedOn: Date;

  @Column('timestamp', { nullable: true })
  DeniedOn: Date;

  @Column('timestamp', { nullable: true })
  CancelledOn: Date;

  @Column('timestamp', { nullable: true })
  CompletedOn: Date;

  @Column('money', { nullable: true })
  NetBook: number;

  @Column('money', { nullable: true })
  Market: number;

  @Column('money', { nullable: true })
  Assessed: number;

  @Column('money', { nullable: true })
  Appraised: number;

  @Column('int')
  ProjectType: number;

  // Workflow Relation
  @Column({ name: 'workflow_id', type: 'int' })
  WorkflowId: number;

  @ManyToOne(() => Workflow, (Workflow) => Workflow.Id)
  @JoinColumn({ name: 'workflow_id' })
  @Index()
  Workflow: Workflow;

  // Agency Relation
  @Column({ name: 'agency_id', type: 'int' })
  AgencyId: number;

  @ManyToOne(() => Agency, (Agency) => Agency.Id)
  @JoinColumn({ name: 'agency_id' })
  @Index()
  Agency: Agency;

  // Tier Level Relation
  @Column({ name: 'trier_level_id', type: 'int' })
  TierLevelId: number;

  @ManyToOne(() => TierLevel, (TierLevel) => TierLevel.Id)
  @JoinColumn({ name: 'trier_level_id' })
  @Index()
  TierLevel: TierLevel;

  // Status Relation
  @Column({ name: 'status_id', type: 'int' })
  StatusId: number;

  @ManyToOne(() => ProjectStatus, (Status) => Status.Id)
  @JoinColumn({ name: 'status_id' })
  @Index()
  Status: ProjectStatus;

  // Risk Relation
  @Column({ name: 'risk_id', type: 'int' })
  RiskId: number;

  @ManyToOne(() => ProjectRisk, (Risk) => Risk.Id)
  @JoinColumn({ name: 'risk_id' })
  @Index()
  Risk: ProjectRisk;
}
