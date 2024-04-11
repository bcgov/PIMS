import { IFetch } from '../useFetch';
import { Agency } from './useAgencyApi';
import { TierLevel } from './useAgencyApi';

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
  //   WorkflowId: number;
  //   Workflow?: Workflow;
  AgencyId: number | null;
  Agency: Agency | null;
  TierLevelId: number;
  TierLevel: TierLevel | null;
  IsDisabled: boolean;
  SortOrder: number;
  RegionalDistrictId: number;
  RegionalDistrict?: Record<string, any>;
  CreatedOn: string;
}

const useAdministrativeAreaApi = (absoluteFetch: IFetch) => {
  const getAdministrativeAreas = async (): Promise<AdministrativeArea[]> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas`);
    return parsedBody as AdministrativeArea[];
  };

  const addAdministrativeArea = async (
    adminArea: Omit<AdministrativeArea, 'Id' | 'CreatedOn'>,
  ): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.post(`/administrativeAreas`, adminArea);
    return parsedBody as AdministrativeArea;
  };

  const getAdminAreaById = async (id: number): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas/${id}`);
    return parsedBody as AdministrativeArea;
  };

  const updateAdminArea = async (
    id: number,
    adminArea: Partial<AdministrativeArea>,
  ): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.put(`/administrativeAreas/${id}`, adminArea);
    return parsedBody as AdministrativeArea;
  };

  return {
    getAdministrativeAreas,
    addAdministrativeArea,
    getAdminAreaById,
    updateAdminArea,
  };
};

export default useAdministrativeAreaApi;
