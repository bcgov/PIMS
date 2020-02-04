import * as ActionTypes from "constants/actionTypes";

//Property List API action

export interface Property {
  pid: number,
  pin: number,
  lat: number,
  long: number,
  address: string
}

export interface StorePropertiesAction {
  type: typeof ActionTypes.STORE_PROPERTY_RESULTS
  propertyList: Property[]
}

export const storePropertiesAction = (propertyList:Property[]) => ({
  type: ActionTypes.STORE_PROPERTY_RESULTS,
  propertyList: propertyList,
});

// Property Detail API action

export interface PropertyDetail {
  pid: number,
  name: string,
  propertyDetail1: string,
  propertyDetail2: string
}

export interface StorePropertiesDetail {
  type: typeof ActionTypes.STORE_PROPERTY_DETAIL
  propertyDetail: PropertyDetail
}

export const storePropertyDetail = (propertyDetail:PropertyDetail) => ({
  type: ActionTypes.STORE_PROPERTY_DETAIL,
  propertyDetail: propertyDetail,
});
