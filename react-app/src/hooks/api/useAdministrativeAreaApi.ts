import { IFetch } from '../useFetch';

export interface AdministrativeArea {
  Id: number;
  Name: string;
  ProvinceId: string;
}

const useAdministrativeAreaApi = (absoluteFetch: IFetch) => {
  const getAdministrativeAreas = async (): Promise<AdministrativeArea[]> => {
    const { parsedBody } = await absoluteFetch.get(`/administrativeAreas`);
    return parsedBody as AdministrativeArea[];
  };

  const addAdministrativeArea = async (
    adminArea: Omit<AdministrativeArea, 'Id'>,
  ): Promise<AdministrativeArea> => {
    const { parsedBody } = await absoluteFetch.post(`/administrativeAreas`, adminArea);
    return parsedBody as AdministrativeArea;
  };

  return {
    getAdministrativeAreas,
    addAdministrativeArea,
  };
};

export default useAdministrativeAreaApi;
