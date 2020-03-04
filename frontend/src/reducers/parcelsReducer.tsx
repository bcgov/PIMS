import * as actionTypes from 'constants/actionTypes';
import { IStoreParcelsAction, IStoreParcelDetail } from 'actions/parcelsActions';
import { IParcel, IParcelDetail } from 'actions/parcelsActions';

export interface IParcelState {
  parcels: IParcel[];
  parcelDetail: IParcelDetail | null;
  pid: number;
}

const initialState: IParcelState = {
  parcels: [],
  parcelDetail: null,
  pid: 0,
};

const parcelsReducer = (state = initialState, action: IStoreParcelsAction | IStoreParcelDetail) => {
  switch (action.type) {
    case actionTypes.STORE_PARCEL_RESULTS:
      return {
        ...state,
        parcels: [...action.parcelList],
      };
    case actionTypes.STORE_PARCEL_DETAIL:
      return {
        ...state,
        parcelDetail: action.parcelDetail,
      };
    default:
      return state;
  }
};

export default parcelsReducer;
