/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
  propertyType: string;
  propertyTypeId: number;
  pid: string;
  pin?: number;
  classificationId: number;
  classification: string;
  description: string;
  projectNumber?: string;
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

  // Financial Values
  estimated: number;
  estimatedFiscalYear?: number;
  netBook: number;
  netBookFiscalYear?: number;

  assessed: number;
  assessedDate?: Date | string;
  appraised: number;
  appraisedDate?: Date | string;

  // Parcel Properties
  landArea: number;
  landLegalDescription: string;
  zoning?: string;
  zoningPotential?: string;

  // Building Properties
  parcelId?: number;
  localId?: string;
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
 * IPropertyFilter interface, provides a model for querying the API for properties.
 */
export interface IPropertyFilter {
  page: number;
  quantity: number;
  pid?: string;
  address?: string;
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
}
