import * as ActionTypes from "constants/actionTypes";

//Parcel List API action

export interface Parcel {
  id: number,
  latitude: number,
  longitude: number
}

export interface StoreParcelsAction {
  type: typeof ActionTypes.STORE_PARCEL_RESULTS
  parcelList: Parcel[]
}

export const storeParcelsAction = (parcelList:Parcel[]) => ({
  type: ActionTypes.STORE_PARCEL_RESULTS,
  parcelList: parcelList,
});

//Parcel Detail API action

export interface Address {
  line1: string,
  line2: string,
  city: string,
  province: string,
  postal: string,
}

export interface Building {
  description: string,
  address: Address,
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

export interface ParcelDetail {
  id: number,
  pid: string,
  latitude: number,
  longitude: number,
  propertyStatus: string,
  propertyClassification: string,
  description: string,
  assessedValue: number,
  address: Address,
  landArea: string,
  landLegalDescription: string,
  buildings: Building[]
}

export interface StoreParcelDetail {
  type: typeof ActionTypes.STORE_PARCEL_DETAIL
  parcelDetail: ParcelDetail
}

export const storeParcelDetail = (parcelDetail:ParcelDetail) => ({
  type: ActionTypes.STORE_PARCEL_DETAIL,
  parcelDetail: parcelDetail,
});
