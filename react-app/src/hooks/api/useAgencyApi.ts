import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { IFetch } from '../useFetch';

export interface Agency {
  Id: number;
  UpdatedById?: string;
  UpdatedOn?: Date;
  CreatedById: string;
  CreatedOn: Date;
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

export type AgencyAdd = Omit<
  Agency,
  'Id' | 'CreatedOn' | 'CreatedById' | 'UpdatedOn' | 'UpdatedById'
>;

const useAgencyApi = (absoluteFetch: IFetch) => {
  const getAgencies = async (sort: CommonFiltering, signal?: AbortSignal): Promise<Agency[]> => {
    const { parsedBody } = await absoluteFetch.get(
      `/agencies`,
      { ...sort, includeRelations: true },
      { signal },
    );
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

  const updateAgencyById = async (id: number, agency: Partial<Agency>) => {
    const response = await absoluteFetch.patch(`/agencies/${id}`, agency);
    return response;
  };

  const addAgency = async (agency: AgencyAdd) => {
    const response = await absoluteFetch.post('/agencies', agency);
    return response;
  };

  return {
    getAgencies,
    getAgenciesNotDisabled,
    getAgenciesWithParent,
    getAgencyById,
    deleteAgencyById,
    updateAgencyById,
    addAgency,
  };
};

export default useAgencyApi;
