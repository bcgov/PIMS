import {
  Entity,
  Column,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Workflow } from '@/typeorm/Entities/Workflow';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { ProjectRisk } from '@/typeorm/Entities/ProjectRisk';
import { BaseEntity } from '@/typeorm/Entities/abstractEntities/BaseEntity';
import { Agency } from './Agency';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectTask } from '@/typeorm/Entities/ProjectTask';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { ProjectStatusHistory } from '@/typeorm/Entities/ProjectStatusHistory';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ProjectAgencyResponse } from './ProjectAgencyResponse';

export interface ProjectMetadata {
  // Exemption Fields
  exemptionRequested?: boolean;
  exemptionApprovedOn?: Date;
  // ERP Fields
  initialNotificationSentOn?: Date;
  thirtyDayNotificationSentOn?: Date;
  sixtyDayNotificationSentOn?: Date;
  ninetyDayNotificationSentOn?: Date;
  onHoldNotificationSentOn?: Date;
  interestReceivedOn?: Date;
  transferredWithinGreOn?: Date;
  clearanceNotificationSentOn?: Date;
  // SPL Fields
  requestForSplReceivedOn?: Date;
  approvedForSplOn?: Date;
  marketedOn?: Date;
  purchaser?: string;
  offerAcceptedOn?: Date;
  adjustedOn?: Date;
  preliminaryFormSignedOn?: Date;
  finalFormSignedOn?: Date;
  priorYearAdjustmentOn?: Date;
  disposedOn?: Date;
  // Removing from SPL
  removalFromSplRequestOn?: Date;
  removalFromSplApprovedOn?: Date;
  // Financials
  assessedOn?: Date;
  appraisedBy?: string;
  appraisedOn?: Date;
  salesCost?: number;
  netProceeds?: number;
  programCost?: number;
  gainLost?: number;
  sppCapitalization?: number;
  gainBeforeSpl?: number;
  ocgFinancialStatement?: number;
  interestComponent?: number;
  plannedFutureUse?: string;
  offerAmount?: number;
  saleWithLeaseInPlace?: boolean;
  priorYearAdjustment?: boolean;
  priorYearAdjustmentAmount?: number;
  realtor?: string;
  realtorRate?: string;
  realtorCommission?: number;
  preliminaryFormSignedBy?: string;
  finalFormSignedBy?: string;
}

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

  @Column('jsonb', {
    nullable: true,
  })
  Metadata: ProjectMetadata;

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
  @Column({ name: 'tier_level_id', type: 'int' })
  TierLevelId: number;

  @ManyToOne(() => TierLevel, (TierLevel) => TierLevel.Id)
  @JoinColumn({ name: 'tier_level_id' })
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

  @OneToMany(() => ProjectProperty, (ProjectProperty) => ProjectProperty.Project)
  ProjectProperties: ProjectProperty[];

  @OneToMany(() => ProjectTask, (ProjectTask) => ProjectTask.Project, {
    nullable: true,
  })
  Tasks: ProjectTask[];

  @OneToMany(() => NotificationQueue, (NotificationQueue) => NotificationQueue.Project, {
    nullable: true,
  })
  Notifications: NotificationQueue[];

  @OneToMany(() => ProjectStatusHistory, (ProjectStatusHistory) => ProjectStatusHistory.Project, {
    nullable: true,
  })
  StatusHistory: ProjectStatusHistory[];

  @OneToMany(() => ProjectNote, (ProjectNote) => ProjectNote.Project, {
    nullable: true,
  })
  Notes: ProjectNote[];

  @OneToMany(
    () => ProjectAgencyResponse,
    (ProjectAgencyResponse) => ProjectAgencyResponse.Project,
    { nullable: true },
  )
  AgencyResponses: ProjectAgencyResponse[];
}
