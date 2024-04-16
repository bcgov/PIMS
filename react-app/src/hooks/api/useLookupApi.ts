import { IFetch } from '../useFetch';

export interface LookupObject {
  Name: string;
  Id: number;
  SortOrder: number;
}

export interface Classification extends LookupObject {
  IsVisible: boolean;
}

export type RegionalDistrict = Omit<LookupObject, 'SortOrder'>;

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

  return {
    getClassifications,
    getConstructionTypes,
    getPredominateUses,
    getRegionalDistricts,
    getTierLevels,
  };
};

export default useLookupApi;
