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

  return {
    getClassifications,
    getConstructionTypes,
    getPredominateUses,
  };
};

export default useLookupApi;
