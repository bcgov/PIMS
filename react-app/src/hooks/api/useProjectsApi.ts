import { BaseEntityInterface } from '@/interfaces/IBaseEntity';
import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';

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
  Manager: string;
  ReportedFiscalYear: string;
  ActualFiscalYear: number;
  Description: string;
  SubmittedOn: Date;
  ApprovedOn: Date;
  DeniedOn: Date;
  CancelledOn: Date;
  CompletedOn: Date;
  NetBook: number;
  Market: number;
  Assessed: number;
  Appraised: number;
  ProjectType: number;
  AgencyId: number;
  Agency: Agency;
  WorkflowId: number;
  Workflow?: Workflow;
  TierLevelId: number;
  TierLevel?: TierLevel;
  StatusId: number;
  Status?: ProjectStatus;
  RiskId: number;
  Risk?: ProjectRisk;
  CreatedOn: string;
}

const useProjectsApi = (absoluteFetch: IFetch) => {
  const getProjects = async () => {
    const { parsedBody } = await absoluteFetch.get('/projects', { includeRelations: true });
    if (parsedBody.error) {
      return [];
    }
    return parsedBody as Project[];
  };

  return {
    getProjects,
  };
};

export default useProjectsApi;
