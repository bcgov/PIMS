import { IFetch } from '../useFetch';

export interface Agency {
  Id: number;
  Name: string;
  Description: string | null;
  Code: string;
  SortOrder: number;
}

const useAgencyApi = (absoluteFetch: IFetch) => {
  const getAgencies = async (): Promise<Agency[]> => {
    const { parsedBody } = await absoluteFetch.get(`/agencies`);
    return parsedBody as Agency[];
  };

  return {
    getAgencies,
  };
};

export default useAgencyApi;
