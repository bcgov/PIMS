import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';
import { User } from '@/hooks/api/useUsersApi';
import { Parcel } from './useParcelsApi';
import { Building } from './useBuildingsApi';
import { DeepPartial } from 'react-hook-form';
import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { GetManyResponse } from '@/interfaces/GetManyResponse';

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
  Tasks?: ProjectTask[];
  Notifications?: ProjectNotification[];
  StatusHistory?: ProjectStatusHistory[];
  Notes?: ProjectNote[];
  Monetaries?: ProjectMonetary[];
  Timestamps?: ProjectTimestamp[];
  ProjectProperties?: ProjectProperty[];
  AgencyResponses?: ProjectAgencyResponse[];
}

export interface ProjectMonetary {
  CreatedById?: string;
  CreatedOn?: Date;
  Id?: number;
  Value?: number;
  MonetaryTypeId?: number;
  ProjectId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
}

export interface ProjectTimestamp {
  CreatedById?: string;
  CreatedOn?: Date;
  Id?: number;
  Date?: Date;
  TimestampTypeId?: number;
  ProjectId?: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
}

export interface ProjectNote {
  CreatedById?: string;
  CreatedOn?: Date;
  Id?: number;
  Note?: string;
  NoteTypeId?: number;
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

export interface ProjectGet extends Project {
  Buildings: Building[];
  Parcels: Parcel[];
}

export interface ProjectProperty {
  CreatedById: string;
  CreatedOn: string;
  UpdatedById: string;
  UpdatedOn: string;
  Id: number;
  ProjectId: number;
  PropertyTypeId: number;
  ParcelId: number | null;
  BuildingId: number | null;
  Parcel: Parcel | null;
  Building: Building | null;
}

export interface ProjectAgencyResponse {
  CreatedById: string;
  CreatedOn: string;
  UpdatedById: string | null;
  UpdatedOn: string | null;
  Id: number;
  ProjectId: number;
  AgencyId: number;
  OfferAmount: string | number;
  NotificationId: number | null;
  Response: number;
  ReceivedOn: Date | null;
  Note: string | null;
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
  | 'StatusId' // Determined in API
  | 'ProjectType' // Determined in API (Disposal)
  | 'RiskId' // Determined in API
>;

export interface ProjectPropertyIds {
  parcels?: number[];
  buildings?: number[];
}

const useProjectsApi = (absoluteFetch: IFetch) => {
  const getProjectById = async (id: number) => {
    const { parsedBody, status } = await absoluteFetch.get(`/projects/disposal/${id}`);
    return { parsedBody, retStatus: status } as { parsedBody: ProjectGet; retStatus: number };
  };
  const updateProject = async (
    id: number,
    project: DeepPartial<ProjectGet>,
    projectPropertyIds?: ProjectPropertyIds,
  ) => {
    let propertyIds = projectPropertyIds;
    propertyIds ??= {
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
      parcels: project.ProjectProperties.filter((a) => a.Parcel).map((a) => a.ParcelId),
      buildings: project.ProjectProperties.filter((a) => a.Building).map((a) => a.BuildingId),
    };
    const response = await absoluteFetch.put(`/projects/disposal/${id}`, {
      project: project,
      propertyIds: propertyIds,
    });
    return response;
  };

  const deleteProjectById = async (id: number) => {
    const response = await absoluteFetch.del(`/projects/disposal/${id}`);
    return response;
  };

  const getProjects = async (sort: CommonFiltering, signal?: AbortSignal) => {
    try {
      const response = await absoluteFetch.get(`/projects`, { ...sort }, { signal });
      if (response.ok) {
        return response.parsedBody as GetManyResponse<Project>;
      }
      return {
        data: [],
        totalCount: 0,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch aborted');
      } else {
        console.error('Error fetching projects:', error);
      }
      return {
        data: [],
        totalCount: 0,
      };
    }
  };

  const getProjectsForExcelExport = async (sort: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get(
      '/projects',
      {
        ...sort,
        excelExport: true,
      },
      { signal },
    );
    if ((parsedBody as Record<string, any>).error) {
      return [];
    }
    return parsedBody as Project[];
  };

  const postProject = async (project: ProjectAdd, projectPropertyIds: ProjectPropertyIds) => {
    const postBody = {
      project,
      projectPropertyIds,
    };
    const response = await absoluteFetch.post('/projects/disposal', postBody);
    return response;
  };

  const updateProjectWatch = async (
    projectId: number,
    responses: Partial<ProjectAgencyResponse>[],
  ) => {
    const response = await absoluteFetch.put(`/projects/disposal/${projectId}/responses`, {
      responses,
    });
    return response;
  };

  return {
    getProjectById,
    updateProject,
    deleteProjectById,
    getProjects,
    getProjectsForExcelExport,
    postProject,
    updateProjectWatch,
  };
};

export default useProjectsApi;
