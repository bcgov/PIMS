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

  const postProject = async (project: ProjectAdd, projectPropertyIds: ProjectPropertyIds) => {
    const postBody = {
      projectBody: project,
      projectProperties: projectPropertyIds,
    };
    const { parsedBody, status } = await absoluteFetch.post('/projects/', postBody);
    return { parsedBody, status };
  };

  return {
    getProjects,
    postProject,
  };
};

export default useProjectsApi;
