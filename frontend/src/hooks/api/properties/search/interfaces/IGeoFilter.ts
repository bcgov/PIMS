import { PropertyType } from 'hooks/api/properties';

export interface IGeoFilter {
  bbox?: number[]; // TODO: Check if this is the correct type.
  service?: string;
  request?: string;
  layers?: string;

  classificationId?: number;
  statusId?: number;
  address?: string;
  administrativeArea?: string;
  projectNumber?: string;
  ignorePropertiesInProjects?: boolean;
  inSurplusPropertyProgram?: boolean;
  inEnhancedReferralProcess?: boolean;
  agencies?: number[];
  bareLandOnly?: boolean;
  includeAllProperties?: boolean;

  minLotArea?: number;
  maxLotArea?: number;
  minMarketValue?: number;
  maxMarketValue?: number;
  minAssessedValue?: number;
  maxAssessedValue?: number;

  // Parcel
  pid?: string;
  minLandArea?: number;
  maxLandArea?: number;

  // Building
  constructionTypeId?: number;
  name?: string;
  predominateUseId?: number;
  parcelId?: number;
  propertyType?: PropertyType;
  floorCount?: number;
  tenancy?: string;
  minRentableArea?: number;
  rentableArea?: number;
  maxRentableArea?: number;
}
