import { ProjectRisk, TierLevel, Workflow } from '@/hooks/api/useProjectsApi';
import { IFetch } from '../useFetch';
import { BuildingConstructionType, BuildingPredominateUse } from '@/hooks/api/useBuildingsApi';
import { PropertyClassification } from '@/interfaces/IProperty';
import { Role } from '@/hooks/api/useRolesApi';
import { Agency } from '@/hooks/api/useAgencyApi';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';

export interface LookupObject {
  Name: string;
  Id: number;
  SortOrder: number;
}

export interface Classification extends LookupObject {
  IsVisible: boolean;
}

export interface Task {
  Name: string;
  Id: number;
  Description: string;
  IsOptional: boolean;
  StatusId: number;
}

export interface MetadataType {
  Name: string;
  Id: number;
  Description: string;
  IsOptional: boolean;
  StatusId: number;
}

export type RegionalDistrict = Omit<LookupObject, 'SortOrder'>;
export type ProjectStatus = Omit<LookupObject, 'SortOrder'>;

export interface PropertyType {
  Name: string;
  Id: number;
  IsDisabled: boolean;
  SortOrder: number;
}

export interface LookupAll {
  Risks: Partial<ProjectRisk>[];
  TimestampTypes: Partial<MetadataType>[];
  MonetaryTypes: Partial<MetadataType>[];
  NoteTypes: Partial<MetadataType>[];
  PropertyTypes: Partial<MetadataType>[];
  Tasks: Partial<Task>[];
  ProjectStatuses: Partial<ProjectStatus>[];
  ProjectTiers: Partial<TierLevel>[];
  ConstructionTypes: Partial<BuildingConstructionType>[];
  PredominateUses: Partial<BuildingPredominateUse>[];
  Classifications: Partial<PropertyClassification>[];
  Roles: Partial<Role>[];
  Agencies: Partial<Agency>[];
  AdministrativeAreas: Partial<AdministrativeArea>[];
  RegionalDistricts: Partial<RegionalDistrict>[];
  Workflows: Partial<Workflow>[];
}

const useLookupApi = (absoluteFetch: IFetch) => {
  const getClassifications = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/property/classifications');
    return parsedBody as Classification[];
  };

  const getConstructionTypes = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/property/constructionTypes');
    return parsedBody as LookupObject[];
  };

  const getPredominateUses = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/property/predominateUses');
    return parsedBody as LookupObject[];
  };

  const getRegionalDistricts = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/regionalDistricts');
    return parsedBody as RegionalDistrict[];
  };

  const getTierLevels = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/project/tierLevels');
    return parsedBody as LookupObject[];
  };

  const getProjectStatuses = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/project/status');
    return parsedBody as ProjectStatus[];
  };

  const getTasks = async (statusId?: number) => {
    const { parsedBody } = await absoluteFetch.get('/lookup/tasks', { statusId: statusId });
    return parsedBody as Task[];
  };

  const getPropertyTypes = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/propertyTypes');
    return parsedBody as PropertyType[];
  };

  const getProjectNoteTypes = async (statusId?: number) => {
    const { parsedBody } = await absoluteFetch.get('/lookup/noteTypes', { statusId: statusId });
    return parsedBody as MetadataType[];
  };

  const getProjectMonetaryTypes = async (statusId?: number) => {
    const { parsedBody } = await absoluteFetch.get('/lookup/monetaryTypes', { statusId: statusId });
    return parsedBody as MetadataType[];
  };

  const getProjectTimestampTypes = async (statusId?: number) => {
    const { parsedBody } = await absoluteFetch.get('/lookup/timestampTypes', {
      statusId: statusId,
    });
    return parsedBody as MetadataType[];
  };

  const getAll = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/all');
    return parsedBody as LookupAll;
  };

  return {
    getClassifications,
    getConstructionTypes,
    getPredominateUses,
    getRegionalDistricts,
    getProjectStatuses,
    getTierLevels,
    getTasks,
    getPropertyTypes,
    getProjectNoteTypes,
    getProjectMonetaryTypes,
    getProjectTimestampTypes,
    getAll,
  };
};

export default useLookupApi;
