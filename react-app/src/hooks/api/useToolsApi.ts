import { IFetch } from '../useFetch';

export interface IAddressModel {
  siteId: string;
  fullAddress: string;
  address1: string;
  administrativeArea: string;
  provinceCode: string;
  latitude: number;
  longitude: number;
  score: number;
}

const useToolsApi = (absoluteFetch: IFetch) => {
  const getAddresses = async (
    address: string,
    minScore: number = undefined,
    maxResults: number = undefined,
    signal?: AbortSignal,
  ): Promise<IAddressModel[]> => {
    const { parsedBody } = await absoluteFetch.get(
      '/tools/geocoder/addresses',
      {
        address,
        minScore,
        maxResults,
      },
      {
        signal,
      },
    );
    return parsedBody as IAddressModel[];
  };
  return {
    getAddresses,
  };
};

export default useToolsApi;
