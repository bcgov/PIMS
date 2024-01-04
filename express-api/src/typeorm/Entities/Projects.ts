import { Entity, Column, Index, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectStatus } from './ProjectStatus';
import { Workflows } from './Workflows';
import { TierLevels } from './TierLevels';
import { ProjectRisks } from './ProjectRisks';
import { Agencies } from './Agencies';
import { BaseEntity } from '@/typeorm/Entities/BaseEntity';

@Entity()
@Index(['Assessed', 'NetBook', 'Market', 'ReportedFiscalYear', 'ActualFiscalYear'])
@Index(['StatusId', 'TierLevelId', 'AgencyId'])
export class ProjectStatusTransitions extends BaseEntity {
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

  @ManyToOne(() => Workflows, (workflow) => workflow.Id)
  @JoinColumn({ name: 'WorkflowId' })
  @Index()
  WorkflowId: Workflows;

  @ManyToOne(() => Agencies, (agency) => agency.Id)
  @JoinColumn({ name: 'AgencyId' })
  @Index()
  AgencyId: Agencies;

  @ManyToOne(() => TierLevels, (tierlevel) => tierlevel.Id)
  @JoinColumn({ name: 'TierLevelId' })
  @Index()
  TierLevelId: TierLevels;

  @ManyToOne(() => ProjectStatus, (status) => status.Id)
  @JoinColumn({ name: 'StatusId' })
  @Index()
  StatusId: ProjectStatus;

  @ManyToOne(() => ProjectRisks, (risk) => risk.Id)
  @JoinColumn({ name: 'RiskId' })
  @Index()
  RiskId: ProjectRisks;
}
