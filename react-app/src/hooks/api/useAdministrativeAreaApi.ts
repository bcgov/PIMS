import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { IFetch } from '../useFetch';

export interface AdministrativeArea {
  Id: number;
  Name: string;
  ProvinceId: string;
  IsDisabled: boolean;
  SortOrder?: number;
  RegionalDistrictId: number;
  RegionalDistrict?: Record<string, any>;
  CreatedOn: string;
}

export interface GetManyResponse<T> {
  data: Array<T>;
  totalCount: number;
}

const useAdministrativeAreaApi = (absoluteFetch: IFetch) => {
  const getAdministrativeAreas = async (
    sort: CommonFiltering,
    signal?: AbortSignal,
  ): Promise<GetManyResponse<AdministrativeArea>> => {
    try {

    
    const response = await absoluteFetch.get(`/administrativeAreas`, { ...sort }, { signal });
    if (response.ok) {
      return response.parsedBody as GetManyResponse<AdministrativeArea>;
    }
    return {
      data: [],
      totalCount: 0,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Fetch aborted');
    } else {
      console.error('Error fetching administrative areas:', error);
    }
    return {
      data: [],
      totalCount: 0,
    };
  }
  };

  const addAdministrativeArea = async (adminArea: Omit<AdministrativeArea, 'Id' | 'CreatedOn'>) => {
    const response = await absoluteFetch.post(`/administrativeAreas`, adminArea);
    return response;
  };

  const getAdminAreaById = async (id: number): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas/${id}`);
    return parsedBody as AdministrativeArea;
  };

  const updateAdminArea = async (id: number, adminArea: Partial<AdministrativeArea>) => {
    const response = await absoluteFetch.put(`/administrativeAreas/${id}`, adminArea);
    return response;
  };

  return {
    getAdministrativeAreas,
    addAdministrativeArea,
    getAdminAreaById,
    updateAdminArea,
  };
};

export default useAdministrativeAreaApi;
