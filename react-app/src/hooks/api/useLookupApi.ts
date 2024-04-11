import { IFetch } from '../useFetch';

export interface LookupObject {
  Name: string;
  Id: number;
  SortOrder: number;
}

export interface Classification extends LookupObject {
  IsVisible: boolean;
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
    return parsedBody as Omit<LookupObject, 'SortOrder'>[];
  };

  const getProjectTierLevels = async () => {
    const { parsedBody } = await absoluteFetch.get('/lookup/project/tier/levels');
    return parsedBody as LookupObject[];
  };

  return {
    getClassifications,
    getConstructionTypes,
    getPredominateUses,
    getRegionalDistricts,
    getProjectTierLevels,
  };
};

export default useLookupApi;
