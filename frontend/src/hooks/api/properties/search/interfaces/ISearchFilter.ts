import { IPageFilter, PropertyType } from 'hooks/api';

export interface ISearchFilter extends IPageFilter {
  bbox?: number[]; // TODO: Check if this is the correct type.
  neLatitude?: number;
  neLongitude?: number;
  swLatitude?: number;
  seLongitude?: number;
  pid?: string;
  projectNumber?: string;
  propertyType?: PropertyType;
  ignorePropertiesInProject?: boolean;
  inSurplusPropertyProgram?: boolean;
  inEnhancedReferralProcess?: boolean;
  name?: string;
  parcelId?: number;
  classificationId?: number;
  constructionTypeId?: number;
  predominateUseUd?: number;
  description?: string;
  address?: string;
  administrativeArea?: string;
  minLandArea?: number;
  maxLandArea?: number;
  minMarketValue?: number;
  maxMarketValue?: number;
  minAssessedValue?: number;
  maxAssessedValue?: number;
  minRentableArea?: number;
  maxRentableArea?: number;
  rentableArea?: number;
  bareLandOnly?: boolean;
  floorCount?: number;
  tenancy?: string;
  agencies?: number[];
}
