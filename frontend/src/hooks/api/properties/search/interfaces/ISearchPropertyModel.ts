export interface ISearchPropertyModel {
  id: number;
  rowVersion: string;
  propertyTypeId: number;
  statusId: number;
  status: string;
  classificationId: number;
  classification: string;
  latitude?: number;
  longitude?: number;
  name: string;
  description?: string;
  projectNumbers: string[];
  projectStatus: string;
  isSensitive: boolean;

  // Agency
  agencyId?: number;
  agency?: string;
  agencyCode?: string;
  subAgency?: string;
  subAgencyCode?: string;

  // Address
  addressId: number;
  address: string;
  administrativeArea: string;
  province: string;
  postal: string;

  // Parcel
  pid?: string;
  pin?: string;
  landArea?: number;
  landLegalDescription: string;
  zoning?: string;
  zoningPotential?: string;

  // Building
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
  transferLeaseOnSale?: boolean;
  rentableArea?: number;

  // Financials
  market?: number;
  marketFiscalYear?: number;
  netBook?: number;
  netBookFiscalYear?: number;
  assessedLand?: number;
  assessedLandDate?: Date;
  assessedBuilding?: number;
  assessedBuildingDate?: Date;
}
