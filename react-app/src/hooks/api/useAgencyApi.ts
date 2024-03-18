import { IFetch } from '../useFetch';

export interface Agency {
  Id: number;
  Name: string;
  Description?: string;
  SortOrder: number;
  ParentId?: number;
  IsDisabled: boolean;
  Email?: string;
  Code: string;
  AddressTo?: string;
  CCEmail?: string;
  SendEmail: boolean;
  children?: Agency[];
}

const useAgencyApi = (absoluteFetch: IFetch) => {
  const getAgencies = async (): Promise<Agency[]> => {
    const { parsedBody } = await absoluteFetch.get(`/agencies`);
    return parsedBody as Agency[];
  };

  const getAgenciesNotDisabled = async (): Promise<Agency[]> => {
    const { parsedBody } = await absoluteFetch.get(`/agencies?isDisabled=false`);
    return parsedBody as Agency[];
  };

  return {
    getAgencies,
    getAgenciesNotDisabled,
  };
};

export default useAgencyApi;
