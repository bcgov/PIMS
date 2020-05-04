/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
  propertyTypeId: number;
  pid: string;
  pin?: string;
  statusId: number;
  status: string;
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
  city: string;
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
  municipality: string;
  zoning: string;
  zoningPotential: string;

  // Building Properties
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
  address?: string;
  municipality?: string;
  projectNumber?: string;
  classificationId?: number;
  statusId?: number;
  agencies?: number | number[];
  minLandArea?: number;
  maxLandArea?: number;
  minLotArea?: number;
  maxLotArea?: number;
}
