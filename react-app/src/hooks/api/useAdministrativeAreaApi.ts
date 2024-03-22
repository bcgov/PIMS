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

  return {
    getAdministrativeAreas,
  };
};

export default useAdministrativeAreaApi;
