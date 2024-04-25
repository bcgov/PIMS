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

export interface ProjectTask {
  TaskId: number;
  IsCompleted: boolean;
}
export interface Project {
  Id: number;
  ProjectNumber: string;
  Name: string;
  Manager?: string;
  ReportedFiscalYear: number;
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
  ProjectTasks?: ProjectTask[];
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

export interface ProjectWithTasks extends Project {
  Tasks: {
    surplusDeclarationReadiness?: boolean;
    tripleBottomLine?: boolean;
    reviewCompletedErp?: boolean;
    reviewCompletedErpExempt?: boolean;
    documentsReceivedReviewCompleted?: boolean;
    appaisalOrdered?: boolean;
    appraisalReceived?: boolean;
    preparationDueDiligence?: boolean;
    firstNationsConsultationUnderway?: boolean;
    firstNationsConsultationComplete?: boolean;
    notificationExemptionToAdm?: boolean;
    confirmationReceivedFromAdm?: boolean;
  };
}

export type ProjectAdd = Omit<
  ProjectWithTasks,
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
  const getProjectById = async (id: number): Promise<Project> => {
    const { parsedBody } = await absoluteFetch.get(`/projects/disposal/${id}`);
    return parsedBody as Project;
  };
  const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
    const { parsedBody } = await absoluteFetch.put(`/projects/disposal/${id}`, project);
    return parsedBody as Project;
  };
  const deleteProjectById = async (id: number) => {
    const { status } = await absoluteFetch.del(`/projects/disposal/${id}`);
    return status;
  };
  const getProjects = async () => {
    const { parsedBody } = await absoluteFetch.get('/projects', { includeRelations: true });
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
    getProjectById,
    updateProject,
    deleteProjectById,
    getProjects,
    postProject,
  };
};

export default useProjectsApi;
