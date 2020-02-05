import * as actionTypes from "constants/actionTypes";
import { StoreParcelsAction, StoreParcelDetail } from "actions/parcelsActions";
import { Parcel, ParcelDetail } from "actions/parcelsActions";

export interface ParcelState {
  parcels: Parcel[],
  parcelDetail: ParcelDetail | null,
  pid: number
}

const initialState: ParcelState = {
  parcels: [],
  parcelDetail: null,
  pid: 0
};

const parcelsReducer = (state = initialState, action: StoreParcelsAction | StoreParcelDetail) => {
  switch (action.type) {
    case actionTypes.STORE_PARCEL_RESULTS:
      return {
        ...state,
        parcels: [ ...action.parcelList ]
        }
    case actionTypes.STORE_PARCEL_DETAIL:
      return {
        ...state,
        parcelDetail: action.parcelDetail
      };
    default:
      return state;
  }
};

export default parcelsReducer;
