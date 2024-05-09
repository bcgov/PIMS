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
  type: 'Feature';
  properties: {
    Id: number;
    Location: GeoPoint;
    PropertyTypeId: PropertyTypes;
    ClassificationId: ClassificationType;
  };
  geometry: {
    type: 'Point';
    coordinates: [49.212751465, -122.873862825];
  };
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
