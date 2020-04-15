import * as ActionTypes from 'constants/actionTypes';

//Parcel List API action

export interface IProperty {
  id: number;
  propertyTypeId: 0 | 1; // 0 = Parcel, 1 = Building
  latitude: number;
  longitude: number;
}

export interface IStoreParcelsAction {
  type: typeof ActionTypes.STORE_PARCEL_RESULTS;
  parcelList: IProperty[];
}

export const storeParcelsAction = (parcelList: IProperty[]): IStoreParcelsAction => ({
  type: ActionTypes.STORE_PARCEL_RESULTS,
  parcelList: parcelList,
});

//Parcel Detail API action
export interface IAddress {
  line1: string;
  line2?: string;
  city?: string;
  cityId: number | any;
  province?: string;
  provinceId: string;
  postal: string;
}

export interface IBuilding {
  id: number;
  localId: string;
  description: string;
  address: IAddress;
  latitude: number | any;
  longitude: number | any;
  buildingFloorCount: number | any;
  buildingConstructionType?: string;
  buildingConstructionTypeId: number | any;
  buildingPredominateUse?: string;
  buildingPredominateUseId: string | any;
  buildingOccupantType?: string;
  buildingOccupantTypeId: number | any;
  leaseExpiry?: string;
  occupantName: string;
  transferLeaseOnSale: boolean;
  buildingTenancy: string;
  rentableArea: number | any;
  agencyId: number | any;
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
}

export interface IFiscal {
  fiscalYear: number | any;
  key: string | any;
  value: number | any;
}

export interface IEvaluation {
  date: Date | any;
  key: string | any;
  value: number | any;
}

export interface IParcel {
  id: number | any;
  pid: string;
  pin: string;
  latitude: number | any;
  longitude: number | any;
  statusId: number | any;
  propertyStatus?: string;
  classification?: string;
  classificationId: number | any;
  description: string;
  address: IAddress | any;
  landArea: number | any;
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  municipality: string;
  agency?: string;
  agencyId: number | any;
  isSensitive: boolean;
  buildings: IBuilding[];
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
}

export interface IAddress {
  line1: string;
  cityId: number | any;
  provinceId: string;
  postal: string;
}

export interface IParcelDetail {
  propertyTypeId: 0;
  parcelDetail: IParcel | null;
}

export interface IBuildingDetail {
  propertyTypeId: 1;
  parcelDetail: IBuilding | null;
}

export type IPropertyDetail = IParcelDetail | IBuildingDetail;

export interface IStoreParcelDetail {
  type: typeof ActionTypes.STORE_PARCEL_DETAIL;
  parcelDetail: IParcelDetail;
}

export const storeParcelDetail = (parcel: IParcel | null): IStoreParcelDetail => ({
  type: ActionTypes.STORE_PARCEL_DETAIL,
  parcelDetail: {
    propertyTypeId: 0,
    parcelDetail: parcel,
  },
});

export interface IStoreBuildingDetail {
  type: typeof ActionTypes.STORE_BUILDING_DETAIL;
  parcelDetail: IBuildingDetail;
}

export const storeBuildingDetail = (building: IBuilding | null): IStoreBuildingDetail => ({
  type: ActionTypes.STORE_BUILDING_DETAIL,
  parcelDetail: {
    propertyTypeId: 1,
    parcelDetail: building,
  },
});
