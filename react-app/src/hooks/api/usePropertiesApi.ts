import { GeoPoint } from '@/interfaces/IProperty';
import { FetchResponse, IFetch } from '../useFetch';
import { Building } from './useBuildingsApi';
import { Parcel } from './useParcelsApi';
import { PropertyTypes } from '@/constants/propertyTypes';
import { ClassificationType } from '@/constants/classificationTypes';
import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { useContext } from 'react';
import { ConfigContext } from '@/contexts/configContext';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { GetManyResponse } from '@/interfaces/GetManyResponse';

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
    Name: string;
    AdministrativeAreaId: number;
    AgencyId: number;
    PID?: number;
    PIN?: number;
    Address1: string;
    ProjectStatusId?: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [49.212751465, -122.873862825];
  };
}

export interface MapFilter {
  PID?: number;
  PIN?: number;
  Address?: string;
  AgencyIds?: number[];
  AdministrativeAreaIds?: number[];
  ClassificationIds?: number[];
  PropertyTypeIds?: number[];
  RegionalDistrictIds?: number[];
  Name?: string;
  Polygon?: string;
}

export interface PropertyUnion {
  PID?: number;
  PIN?: number;
  Address: string;
  Agency: string;
  AdministrativeArea: string;
  RegionalDistrict: string;
  Name: string;
  UpdatedOn: Date;
  PropertyType: string;
}

export interface ImportResult {
  FileName: string;
  CompletionPercentage: number;
  Id: number;
  Results: {
    action: 'inserted' | 'updated' | 'error' | 'ignored';
    rowNumber: number;
    reason?: string;
  }[];
  CreatedById: string;
  CreatedOn: Date;
  UpdatedById?: string;
  UpdatedOn?: Date;
  Message?: string;
}

export interface PropertiesUnionResponse {
  properties: PropertyUnion[];
  totalCount: number;
}

export interface PropertyId {
  buildingId?: number;
  parcelId?: number;
}

const usePropertiesApi = (absoluteFetch: IFetch) => {
  const config = useContext(ConfigContext);
  const keycloak = useSSO();

  const propertiesFuzzySearch = async (keyword: string) => {
    const { parsedBody } = await absoluteFetch.get('/properties/search/fuzzy', {
      keyword,
      take: 5,
    });
    return parsedBody as PropertyFuzzySearch;
  };

  // Retrieves properties for map population
  const propertiesGeoSearch = async (filter: MapFilter) => {
    const noNullParam = filter
      ? Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(filter).filter(([_, v]) => {
            // No empty arrays
            if (Array.isArray(v) && v.length === 0) return false;
            // No undefined or null
            return v != null;
          }),
        )
      : undefined;
    const { parsedBody } = await absoluteFetch.get('/properties/search/geo', noNullParam);
    return parsedBody as PropertyGeo[];
  };

  const getPropertiesUnion = async (filter: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get('/properties', filter, { signal });
    return parsedBody as PropertiesUnionResponse;
  };

  const getPropertiesForExcelExport = async (filter: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get(
      '/properties',
      {
        ...filter,
        excelExport: true,
      },
      { signal },
    );
    if ((parsedBody as Record<string, any>)?.error) {
      return;
    }
    return parsedBody as (Parcel | Building)[];
  };

  const propertiesDataSource = async (
    filter: CommonFiltering,
    signal?: AbortSignal,
  ): Promise<GetManyResponse<PropertyUnion>> => {
    try {
      const response = await absoluteFetch.get('/properties', filter, { signal });
      if (response.ok) {
        return response.parsedBody as GetManyResponse<PropertyUnion>;
      }
      return {
        data: [],
        totalCount: 0,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch aborted');
      } else {
        console.error('Error fetching properties:', error);
      }
      return {
        data: [],
        totalCount: 0,
      };
    }
  };

  const uploadBulkSpreadsheet = async (file: File) => {
    const form = new FormData();
    form.append('spreadsheet', file, file.name);
    const result = await fetch(config.API_HOST + '/properties/import', {
      method: 'POST',
      body: form, //Using standard fetch here instead of the wrapper so that we can handle this form-data body without converting to JSON.
      headers: { Authorization: keycloak.getAuthorizationHeaderValue() },
      signal: AbortSignal.timeout(5000),
    });
    const text = await result.text();
    try {
      (result as FetchResponse).parsedBody = JSON.parse(text);
    } catch {
      (result as FetchResponse).parsedBody = text as any;
    }
    return result;
  };

  const getImportResults = async (filter: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get('/properties/import/results', filter, {
      signal,
    });
    return parsedBody as ImportResult[];
  };

  const getLinkedProjectsToProperty = async (propertyId: PropertyId) => {
    try {
      const params: Record<string, any> = {};
      if (propertyId.buildingId !== undefined && propertyId.buildingId !== null) {
        params.buildingId = propertyId.buildingId.toString();
      }
      if (propertyId.parcelId !== undefined && propertyId.parcelId !== null) {
        params.parcelId = propertyId.parcelId.toString();
      }
      const { parsedBody } = await absoluteFetch.get('/properties/search/linkedProjects', params);
      return parsedBody as any[];
    } catch {
      return [];
    }
  };

  return {
    propertiesFuzzySearch,
    propertiesGeoSearch,
    getPropertiesUnion,
    uploadBulkSpreadsheet,
    getImportResults,
    propertiesDataSource,
    getPropertiesForExcelExport,
    getLinkedProjectsToProperty,
  };
};

export default usePropertiesApi;
