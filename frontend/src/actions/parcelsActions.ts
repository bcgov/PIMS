import { PropertyTypes } from 'constants/propertyTypes';
import { ILeasedLand } from 'features/mapSideBar/SidebarContents/AssociatedLandForm';

//Parcel List API action

export interface IProperty {
  id: number | '';
  propertyTypeId?: PropertyTypes;
  agencyId: number | '';
  agency: string;
  subAgency?: string;
  agencyFullName?: string;
  subAgencyFullName?: string;
  latitude: number | '';
  longitude: number | '';
  name?: string;
  description?: string;
  projectNumbers?: string[];
  projectStatus?: string;
  projectWorkflow?: string;
  isSensitive: boolean | '';
  createdOn?: string;
  updatedOn?: string;
  updatedByEmail?: string;
  updatedByName?: string;
}

//Parcel Detail API action
export interface IAddress {
  id?: number | undefined;
  line1: string;
  line2?: string;
  administrativeArea: string;
  province?: string;
  provinceId: string;
  postal: string;
}

export enum LeasedLandTypes {
  owned = 0,
  leased = 1,
  other = 2,
}

export interface IBuilding extends IProperty {
  parcelId: number | '';
  pid: number | '';
  address: IAddress;
  buildingFloorCount?: number | '';
  buildingConstructionType?: string;
  buildingConstructionTypeId: number | '';
  buildingPredominateUse?: string;
  buildingPredominateUseId: number | '';
  buildingOccupantType?: string;
  buildingOccupantTypeId: number | '';
  classificationId: number | '';
  classification: string;
  encumbranceReason: string;
  leaseExpiry?: string;
  occupantName: string;
  transferLeaseOnSale: boolean;
  buildingTenancy: string;
  buildingTenancyUpdatedOn?: string;
  rentableArea: number | '';
  totalArea: number | '';
  agencyCode: string;
  assessedLand: number | '';
  assessedBuilding: number | '';
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
  parcels: IParcel[];
  leasedLandMetadata?: ILeasedLand[];
  rowVersion?: string;
}

export interface IFlatBuilding extends IProperty {
  parcelId: number;
  address: string;
  administrativeArea: string;
  postal: string;
  province: string;
  buildingFloorCount?: number | '';
  buildingConstructionType?: string;
  buildingConstructionTypeId: number | '';
  buildingPredominateUse?: string;
  buildingPredominateUseId: number | '';
  buildingOccupantType?: string;
  buildingOccupantTypeId: number | '';
  classificationId: number | '';
  classification: string;
  leaseExpiry?: string;
  occupantName: string;
  transferLeaseOnSale: boolean;
  buildingTenancy: string;
  rentableArea: number | '';
  agencyCode: string;
  assessedLand: number | '';
  assessedBuilding: number | '';
  netBook: number | '';
  leasedLand: {
    type: LeasedLandTypes;
  };
}

export interface IFiscal {
  parcelId?: number;
  buildingId?: number;
  fiscalYear?: number | '';
  key: string;
  value: number | '';
  rowVersion?: string;
}

export interface IEvaluation {
  parcelId?: number;
  buildingId?: number;
  date?: Date | string;
  key: string;
  firm?: string;
  value: number | '';
  rowVersion?: string;
}

export interface IParcel extends IProperty {
  pid?: string;
  pin?: number | '';
  classification?: string;
  classificationId: number | '';
  encumbranceReason: string;
  address?: IAddress;
  landArea: number | '';
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  buildings: IBuilding[];
  parcels: Partial<IParcel[]>;
  assessedLand: number | '';
  assessedBuilding: number | '';
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
  rowVersion?: string;
}

export interface IFlatParcel extends IProperty {
  pid?: string;
  pin?: number | '';
  classification?: string;
  classificationId: number | '';
  address: string;
  administrativeArea: string;
  postal: string;
  landArea: number | '';
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  agencyId: number | '';
  isSensitive: boolean;
  buildings: IBuilding[];
  assessedLand: number | '';
  assessedBuilding: number | '';
  netBook: number | '';
}

export interface IParcelDetail {
  propertyTypeId: PropertyTypes;
  parcelDetail: IParcel | null;
  position?: [number, number]; // (optional) a way to override the positioning of the map popup
}

export interface IBuildingDetail {
  propertyTypeId: 1;
  parcelDetail: IBuilding | null;
  position?: [number, number]; // (optional) a way to override the positioning of the map popup
}

export type IPropertyDetail = IParcelDetail | IBuildingDetail;
