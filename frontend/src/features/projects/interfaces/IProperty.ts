import { IParentParcel } from '.';

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
  name: string;
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
  provinceId?: string;
  postal: string;

  // Financial Values
  market: number | '';
  marketFiscalYear?: number;
  marketRowVersion?: string;
  netBook: number | '';
  netBookFiscalYear?: number;
  netBookRowVersion?: string;

  assessedLand?: number | '';
  assessedLandDate?: Date | string;
  assessedLandFirm?: string;
  assessedLandRowVersion?: string;
  assessedBuilding?: number | '';
  assessedBuildingDate?: Date | string;
  assessedBuildingFirm?: string;
  assessedBuildingRowVersion?: string;

  // Parcel Properties
  landArea: number;
  landLegalDescription: string;
  zoning?: string;
  zoningPotential?: string;
  parcels?: IParentParcel[];

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
