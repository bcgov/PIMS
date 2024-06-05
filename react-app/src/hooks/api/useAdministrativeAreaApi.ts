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

const useAdministrativeAreaApi = (absoluteFetch: IFetch) => {
  const getAdministrativeAreas = async (sort?: CommonFiltering): Promise<AdministrativeArea[]> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas`, { ...sort });
    return parsedBody as AdministrativeArea[];
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
