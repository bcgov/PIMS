/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
  propertyType: string;
  propertyTypeId: number;
  pid: string;
  pin?: number;
  name?: string;
  classificationId: number;
  classification: string;
  description: string;
  projectNumbers?: string[];
  latitude: number;
  longitude: number;
  isSensitive: boolean;
  agencyId: number;
  agency: string;
  agencyCode: string;
  subAgency?: string;
  subAgencyCode?: string;

  addressId: number;
  address: string;
  administrativeArea: string;
  province: string;
  postal: string;
  city: string;

  // Financial Values
  market: number;
  marketFiscalYear?: number;
  netBook: number;
  netBookFiscalYear?: number;

  assessedLand?: number;
  assessedLandDate?: Date | string;
  assessedBuilding?: number;
  assessedBuildingDate?: Date | string;

  // Parcel Properties
  landArea: number;
  landLegalDescription: string;
  zoning?: string;
  zoningPotential?: string;

  // Building Properties
  parcelId?: number;
  constructionTypeId?: number;
  constructionType?: string;
  predominateUseId?: number;
  predominateUse?: string;
  occupantTypeId?: number;
  occupantType?: string;
  floorCount?: number;
  tenancy?: string;
  occupantName?: string;
  leaseExpiry?: Date | string;
  transferLeaseOnSale?: boolean;
  rentableArea?: number;
}

/**
 * IPropertyQueryParams interface, provides a model for querying the API for properties.
 */
export interface IPropertyQueryParams {
  page: number;
  quantity: number;
  pid?: string;
  address?: string;
  name?: string;
  administrativeArea?: string;
  projectNumber?: string;
  classificationId?: number;
  agencies?: number | number[];
  minLandArea?: number;
  maxLandArea?: number;
  minLotArea?: number;
  maxLotArea?: number;
  all?: boolean;
  parcelId?: number;
  propertyType?: string;
  inSurplusPropertyProgram?: boolean;
  inEnhancedReferralProcess?: boolean;
  bareLandOnly?: boolean;
  maxNetBookValue?: number | string;
  maxAssessedValue?: number | string;
  maxMarketValue?: number | string;
}
