import { IFetch } from '../useFetch';

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

export interface NoteType {
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
    return parsedBody as NoteType[];
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
  };
};

export default useLookupApi;
