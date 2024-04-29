import { IFetch } from '../useFetch';
import { Building } from './useBuildingsApi';
import { Parcel } from './useParcelsApi';

export interface PropertyFuzzySearch {
  Parcels: Parcel[];
  Buildings: Building[];
}

const usePropertiesApi = (absoluteFetch: IFetch) => {
  const propertiesFuzzySearch = async (keyword: string) => {
    const { parsedBody } = await absoluteFetch.get('/properties/search/fuzzy', {
      keyword,
      take: 2,
    });
    return parsedBody as PropertyFuzzySearch;
  };

  return {
    propertiesFuzzySearch,
  };
};

export default usePropertiesApi;
