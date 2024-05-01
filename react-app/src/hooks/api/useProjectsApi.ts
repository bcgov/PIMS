import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';
import { User } from '@/hooks/api/useUsersApi';

export interface TierLevel extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
  Description?: string;
}
export interface ProjectStatus extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
  Description?: string;
  Code: string;
  GroupName?: string;
  IsMilestone: boolean;
  IsTerminal: boolean;
  Route: string;
}
export interface Workflow extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
  Description?: string;
  Code: string;
}
export interface ProjectRisk extends BaseEntityInterface {
  Id: number;
  Name: string;
  IsDisabled: boolean;
  SortOrder: number;
  Description?: string;
  Code: string;
}
export interface Project {
  Id: number;
  ProjectNumber: string;
  Name: string;
  Manager?: string;
  ReportedFiscalYear: string;
  ActualFiscalYear: number;
  Description?: string;
  SubmittedOn?: Date;
  ApprovedOn?: Date;
  DeniedOn?: Date;
  CancelledOn?: Date;
  CompletedOn?: Date;
  NetBook?: number;
  Market?: number;
  Assessed?: number;
  Appraised?: number;
  ProjectType: number;
  AgencyId: number;
  Agency?: Agency;
  WorkflowId: number;
  Workflow?: Workflow;
  TierLevelId: number;
  TierLevel?: TierLevel;
  StatusId: number;
  Status?: ProjectStatus;
  RiskId: number;
  Risk?: ProjectRisk;
  CreatedOn: string;
  CreatedBy?: User;
  UpdatedOn?: string;
  UpdatedBy?: User;
  Metadata?: ProjectMetadata;
  Tasks?: ProjectTask[];
  Notifications?: ProjectNotification[];
  StatusHistory?: ProjectStatusHistory[];
  Notes?: ProjectNote[];
}

export interface ProjectNote {
  CreatedById?: string;
  CreatedOn?: Date;
  Id?: number;
  Note?: string;
  NoteType?: number;
  ProjectId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
}
export interface ProjectStatusHistory {
  CreatedById?: string;
  CreatedOn?: Date;
  Id?: number;
  ProjectId?: number;
  StatusId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
  WorkflowId?: number;
}
export interface ProjectNotification {
  Bcc?: string;
  Body?: string;
  BodyType?: string;
  Cc?: string;
  ChesMessageId?: string;
  ChesTransactionId?: string;
  CreatedById?: string;
  CreatedOn?: Date;
  Encoding?: string;
  Id?: number;
  Key?: string;
  Priority?: string;
  ProjectId?: number;
  SendOn?: Date;
  Status?: number;
  Subject?: string;
  Tag?: string;
  TemplateId?: number;
  To?: string;
  ToAgencyId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
}

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
  gainLoss?: number;
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

// All values optional because it's not clear what filter will be used.
export interface ProjectTask {
  CompletedOn?: Date;
  CreatedById?: string;
  CreatedOn?: Date;
  IsCompleted?: boolean;
  ProjectId?: number;
  TaskId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
}

export type ProjectAdd = Omit<
  Project,
  | 'Id'
  | 'CreatedOn'
  | 'CreatedById'
  | 'UpdatedOn'
  | 'UpdatedById'
  | 'ProjectNumber' // Determined in API
  | 'AgencyId' // Determined in API (from user's agency)
  | 'WorkflowId' // Determined in API
  | 'StatusId' // Determined in API
  | 'ProjectType' // Determined in API (Disposal)
  | 'RiskId' // Determined in API
  | 'ActualFiscalYear' // TODO: Do we need this?
  | 'ReportedFiscalYear' // TODO: Do we need this?
>;

export interface ProjectPropertyIds {
  parcels?: number[];
  buildings?: number[];
}

const useProjectsApi = (absoluteFetch: IFetch) => {
  const getProjects = async () => {
    const { parsedBody } = await absoluteFetch.get('/projects', { includeRelations: true });
    if (parsedBody.error) {
      return [];
    }
    return parsedBody as Project[];
  };

  const getProjectsForExcelExport = async () => {
    const { parsedBody } = await absoluteFetch.get('/projects', {
      includeRelations: true,
      excelExport: true,
    });
    if (parsedBody.error) {
      return [];
    }
    return parsedBody as Project[];
  };

  const postProject = async (project: ProjectAdd, projectPropertyIds: ProjectPropertyIds) => {
    const postBody = {
      project,
      projectPropertyIds,
    };
    const { parsedBody, status } = await absoluteFetch.post('/projects/disposal', postBody);
    return { parsedBody, status };
  };

  return {
    getProjects,
    getProjectsForExcelExport,
    postProject,
  };
};

export default useProjectsApi;
