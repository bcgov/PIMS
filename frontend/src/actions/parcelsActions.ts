import * as ActionTypes from 'constants/actionTypes';

//Parcel List API action

export enum PropertyTypes {
  PARCEL = 0,
  BUILDING = 1,
  DRAFT_PARCEL = 2,
  DRAFT_BUILDING = 3,
}

export interface IProperty {
  id: number;
  propertyTypeId: PropertyTypes;
  latitude: number;
  longitude: number;
  name?: string;
  projectNumber?: string;
  projectStatus?: string;
}

export interface IStoreParcelsAction {
  type: typeof ActionTypes.STORE_PARCEL_RESULTS;
  parcelList: IProperty[];
}

export interface IStoreDraftParcelsAction {
  type: typeof ActionTypes.STORE_DRAFT_PARCEL_RESULTS;
  draftParcelList: IProperty[];
}

export interface IStoreParcelAction {
  type: typeof ActionTypes.STORE_PARCEL_FROM_MAP_EVENT;
  parcel: IProperty;
}

export const storeDraftParcelsAction = (parcelList: IProperty[]): IStoreDraftParcelsAction => ({
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

export interface IBuilding {
  id: number;
  parcelId: number;
  projectNumber?: string;
  name: string;
  description: string;
  address: IAddress;
  latitude: number | '';
  longitude: number | '';
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
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
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

export interface IParcel {
  id?: number | '';
  pid?: string;
  pin?: number | '';
  projectNumber?: string;
  latitude: number | '';
  longitude: number | '';
  classification?: string;
  classificationId: number | '';
  name: string;
  description: string;
  address?: IAddress;
  landArea: number | '';
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  agency?: string;
  agencyId: number | '';
  isSensitive: boolean;
  buildings: IBuilding[];
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
}

export interface IParcelDetail {
  propertyTypeId: 0;
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
): IStoreParcelDetail => ({
  type: ActionTypes.STORE_PARCEL_DETAIL,
  parcelDetail: {
    propertyTypeId: 0,
    parcelDetail: parcel,
    position,
  },
});

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
