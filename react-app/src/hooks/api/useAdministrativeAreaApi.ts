import { IFetch } from '../useFetch';

export interface AdministrativeArea {
  Id: number;
  Name: string;
  ProvinceId: string;
  IsDisabled: boolean;
  SortOrder: number;
  RegionalDistrictId: number;
  RegionalDistrict?: Record<string, any>;
  CreatedOn: string;
}

const useAdministrativeAreaApi = (absoluteFetch: IFetch) => {
  const getAdministrativeAreas = async (): Promise<AdministrativeArea[]> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas`);
    return parsedBody as AdministrativeArea[];
  };

  const addAdministrativeArea = async (
    adminArea: Omit<AdministrativeArea, 'Id' | 'CreatedOn'>,
  ): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.post(`/administrativeAreas`, adminArea);
    return parsedBody as AdministrativeArea;
  };

  const getAdminAreaById = async (id: number): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas/${id}`);
    return parsedBody as AdministrativeArea;
  };

  const updateAdminArea = async (
    id: number,
    adminArea: Partial<AdministrativeArea>,
  ): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.put(`/administrativeAreas/${id}`, adminArea);
    return parsedBody as AdministrativeArea;
  };

  return {
    getAdministrativeAreas,
    addAdministrativeArea,
    getAdminAreaById,
    updateAdminArea,
  };
};

export default useAdministrativeAreaApi;
