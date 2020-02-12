import * as ActionTypes from "constants/actionTypes";

//Parcel List API action

export interface IParcel {
  id: number,
  latitude: number,
  longitude: number
}

export interface IStoreParcelsAction {
  type: typeof ActionTypes.STORE_PARCEL_RESULTS
  parcelList: IParcel[]
}

export const storeParcelsAction = (parcelList: IParcel[]) => ({
  type: ActionTypes.STORE_PARCEL_RESULTS,
  parcelList: parcelList,
});

//Parcel Detail API action

export interface IAddress {
  line1: string,
  line2: string,
  city: string,
  province: string,
  postal: string,
}

export interface IBuilding {
  description: string,
  address: IAddress,
  latitude: number,
  longitude: number,
  localId: string,
  constructionType: string,
  postal: string,
  buildingFloorCount: number,
  buildingPredominateUse: string,
  buildingTenancy: string,
  buildingNetBookValue: number
}

export interface IParcelDetail {
  id: number,
  pid: string,
  latitude: number,
  longitude: number,
  propertyStatus: string,
  propertyClassification: string,
  description: string,
  assessedValue: number,
  address: IAddress,
  landArea: string,
  landLegalDescription: string,
  buildings: IBuilding[],
  agency: string,
}

export interface IStoreParcelDetail {
  type: typeof ActionTypes.STORE_PARCEL_DETAIL
  parcelDetail: IParcelDetail
}

export const storeParcelDetail = (parcelDetail: IParcelDetail | null) => ({
  type: ActionTypes.STORE_PARCEL_DETAIL,
  parcelDetail: parcelDetail,
});
