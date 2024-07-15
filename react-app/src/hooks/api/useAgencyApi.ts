import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { IFetch } from '../useFetch';
import { GetManyResponse } from '@/interfaces/GetManyResponse';

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
  const getAgencies = async (
    sort: CommonFiltering,
    signal?: AbortSignal,
  ): Promise<GetManyResponse<Agency>> => {
    try {
      const response = await absoluteFetch.get(`/agencies`, { ...sort }, { signal });
      if (response.ok) {
        return response.parsedBody as GetManyResponse<Agency>;
      }
      return {
        data: [],
        totalCount: 0,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch aborted');
      } else {
        console.error('Error fetching agencies:', error);
      }
      return {
        data: [],
        totalCount: 0,
      };
    }
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
    getAgencyById,
    deleteAgencyById,
    updateAgencyById,
    addAgency,
  };
};

export default useAgencyApi;
