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
  line2: string;
  city: string;
  province: string;
  postal: string;
}

export interface IBuilding {
  id: number;
  description: string;
  address: IAddress;
  latitude: number;
  longitude: number;
  localId: string;
  constructionType: string;
  postal: string;
  buildingFloorCount: number;
  buildingPredominateUse: string;
  buildingTenancy: string;
  evaluations: IEvaluation[];
}

export interface IEvaluation {
  fiscalYear: number;
  estimatedValue: number;
  assessedValue: number;
  netBookValue: number;
}

export interface IParcel {
  id: number;
  pid: string;
  latitude: number;
  longitude: number;
  propertyStatus: string;
  classification: string;
  description: string;
  evaluations: IEvaluation[];
  address: IAddress;
  landArea: string;
  landLegalDescription: string;
  buildings: IBuilding[];
  agency: string;
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
