import { GeoPoint } from '@/interfaces/IProperty';
import { IFetch } from '../useFetch';
import { Building } from './useBuildingsApi';
import { Parcel } from './useParcelsApi';
import { PropertyTypes } from '@/constants/propertyTypes';
import { ClassificationType } from '@/constants/classificationTypes';

export interface PropertyFuzzySearch {
  Parcels: Parcel[];
  Buildings: Building[];
}

export interface PropertyGeo {
  Id: number;
  Location: GeoPoint;
  PropertyTypeId: PropertyTypes;
  ClassificationId: ClassificationType;
}

const usePropertiesApi = (absoluteFetch: IFetch) => {
  const propertiesFuzzySearch = async (keyword: string) => {
    const { parsedBody } = await absoluteFetch.get('/properties/search/fuzzy', {
      keyword,
      take: 2,
    });
    return parsedBody as PropertyFuzzySearch;
  };

  const propertiesGeoSearch = async () => {
    const { parsedBody } = await absoluteFetch.get('/properties/search/geo');
    return parsedBody as PropertyGeo[];
  };

  return {
    propertiesFuzzySearch,
    propertiesGeoSearch,
  };
};

export default usePropertiesApi;
