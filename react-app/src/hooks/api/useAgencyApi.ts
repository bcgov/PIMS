import { IFetch } from '../useFetch';

export interface Agency {
  Id: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
  Name: string;
  Description?: string;
  SortOrder: number;
  ParentId?: number;
  Parent?: Agency;
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

  const getAgenciesWithParent = async (): Promise<Agency[]> => {
    const { parsedBody } = await absoluteFetch.get(`/agencies?includeRelations=true`);
    return parsedBody as Agency[];
  };

  const getAgencyById = async (id: number): Promise<Agency> => {
    const { parsedBody } = await absoluteFetch.get(`/agencies/${id}`);
    return parsedBody as Agency;
  };

  const deleteAgencyById = async (id: number): Promise<number> => {
    const { status } = await absoluteFetch.del(`/agencies/${id}`);
    return status;
  };

  const updateAgencyById = async (id: number, agency: Partial<Agency>): Promise<Agency> => {
    const { parsedBody } = await absoluteFetch.patch(`/agencies/${id}`, agency);
    return parsedBody as Agency;
  };

  return {
    getAgencies,
    getAgenciesNotDisabled,
    getAgenciesWithParent,
    getAgencyById,
    deleteAgencyById,
    updateAgencyById,
  };
};

export default useAgencyApi;
