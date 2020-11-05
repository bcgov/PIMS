/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
  projectPropertyId?: number;
  propertyTypeId: number;
  propertyType: string;
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
  cityId: number;
  city: string;
  province: string;
  postal: string;

  // Financial Values
  estimated: number;
  estimatedFiscalYear?: number;
  estimatedRowVersion?: string;
  netBook: number;
  netBookFiscalYear?: number;
  netBookRowVersion?: string;

  assessed: number;
  assessedDate?: Date | string;
  assessedFirm?: string;
  assessedRowVersion?: string;
  appraised: number;
  appraisedDate?: Date | string;
  appraisedFirm?: string;
  appraisedRowVersion?: string;

  // Parcel Properties
  landArea: number;
  landLegalDescription: string;
  municipality?: string;
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
  rowVersion?: string;
}
