/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
  propertyTypeId: string;
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
  subagency?: string;

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
  assessedDate?: Date;
  appraised: number;
  appraisedDate?: Date;

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
  leaseExpiry?: Date;
  TransferLeaseOnSale?: boolean;
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
  classificationId?: number;
  statusId?: number;
  agencies?: number[];
}
