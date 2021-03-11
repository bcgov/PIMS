import { ILeasedLand } from 'features/mapSideBar/SidebarContents/AssociatedLandForm';
import * as ActionTypes from 'constants/actionTypes';
import { PointFeature } from 'components/maps/types';
import { PropertyTypes } from 'constants/propertyTypes';

//Parcel List API action

export interface IProperty {
  id: number | '';
  propertyTypeId?: PropertyTypes;
  agencyId?: number | '';
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

export interface IStoreParcelsAction {
  type: typeof ActionTypes.STORE_PARCEL_RESULTS;
  parcelList: IProperty[];
}

export interface IStoreDraftParcelsAction {
  type: typeof ActionTypes.STORE_DRAFT_PARCEL_RESULTS;
  draftParcelList: PointFeature[];
}

export interface IStoreParcelAction {
  type: typeof ActionTypes.STORE_PARCEL_FROM_MAP_EVENT;
  parcel: IProperty;
}

export const storeDraftParcelsAction = (parcelList: PointFeature[]): IStoreDraftParcelsAction => ({
  type: ActionTypes.STORE_DRAFT_PARCEL_RESULTS,
  draftParcelList: parcelList,
});

export const storeParcelsAction = (parcelList: IProperty[]): IStoreParcelsAction => ({
  type: ActionTypes.STORE_PARCEL_RESULTS,
  parcelList: parcelList,
});

export const storeParcelAction = (parcel: IProperty): IStoreParcelAction => ({
  type: ActionTypes.STORE_PARCEL_FROM_MAP_EVENT,
  parcel,
});

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
  agencyId: number | '';
  agency: string;
  agencyCode: string;
  subAgency?: string;
  assessedLand: number | '';
  assessedBuilding: number | '';
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
  parcels: IParcel[];
  leasedLandMetadata?: ILeasedLand[];
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
  agencyId: number | '';
  agency: string;
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
  agency?: string;
  subAgency?: string;
  agencyId: number | '';
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
  agency?: string;
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

export interface IStoreParcelDetail {
  type: typeof ActionTypes.STORE_PARCEL_DETAIL;
  parcelDetail: IParcelDetail;
}

export const storeParcelDetail = (
  parcel: IParcel | null,
  position?: [number, number],
): IStoreParcelDetail => {
  return {
    type: ActionTypes.STORE_PARCEL_DETAIL,
    parcelDetail: {
      propertyTypeId: parcel?.propertyTypeId as PropertyTypes,
      parcelDetail: parcel,
      position,
    },
  };
};

export interface IStoreBuildingDetail {
  type: typeof ActionTypes.STORE_BUILDING_DETAIL;
  parcelDetail: IBuildingDetail;
}

export const storeBuildingDetail = (
  building: IBuilding | null,
  position?: [number, number],
): IStoreBuildingDetail => ({
  type: ActionTypes.STORE_BUILDING_DETAIL,
  parcelDetail: {
    propertyTypeId: 1,
    parcelDetail: building,
    position,
  },
});

export interface IStoreAssociatedBuildingDetail {
  type: typeof ActionTypes.STORE_ASSOCIATED_BUILDING_DETAIL;
  associatedBuildingDetail: IBuildingDetail;
}

export const storeAssociatedBuilding = (
  building: IBuilding | null,
  position?: [number, number],
): IStoreAssociatedBuildingDetail => ({
  type: ActionTypes.STORE_ASSOCIATED_BUILDING_DETAIL,
  associatedBuildingDetail: {
    propertyTypeId: 1,
    parcelDetail: building,
    position,
  },
});
