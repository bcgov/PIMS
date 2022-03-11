import { IPageFilter, PropertyType } from 'hooks/api';

export interface IPropertyFilter extends IPageFilter {
  bbox?: number[];
  neLatitude?: number;
  neLongitude?: number;
  swLatitude?: number;
  swLongitude?: number;
  projectNumber?: string;
  propertyType?: PropertyType;
  IgnorePropertiesInProjects?: boolean;
  InSurplusPropertyProgram?: boolean;
  InEnhancedReferralProcess?: boolean;
  name?: string;
  parcelId?: number;
  classificationId?: number;
  description?: string;
  address?: string;
  administrativeArea?: string;
  minMarketValue?: number;
  maxMarketValue?: number;
  bareLandOnly?: boolean;
  rentableArea?: number;
  minAssessedValue?: number;
  maxAssessedValue?: number;
  agencies?: number[];
}
