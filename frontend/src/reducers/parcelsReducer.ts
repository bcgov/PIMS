import * as actionTypes from 'constants/actionTypes';
import {
  IStoreParcelsAction,
  IStoreParcelDetail,
  IPropertyDetail,
  IStoreBuildingDetail,
  IStoreParcelAction,
  IStoreDraftParcelsAction,
} from 'actions/parcelsActions';
import { IProperty } from 'actions/parcelsActions';

export interface IParcelState {
  parcels: IProperty[];
  draftParcels: IProperty[];
  parcelDetail: IPropertyDetail | null;
  pid: number;
}

const initialState: IParcelState = {
  parcels: [],
  draftParcels: [],
  parcelDetail: null,
  pid: 0,
};

const parcelsReducer = (
  state = initialState,
  action:
    | IStoreParcelsAction
    | IStoreDraftParcelsAction
    | IStoreParcelDetail
    | IStoreBuildingDetail
    | IStoreParcelAction,
) => {
  switch (action.type) {
    case actionTypes.STORE_PARCEL_RESULTS:
      return {
        ...state,
        parcels: [...action.parcelList],
      };
    case actionTypes.STORE_DRAFT_PARCEL_RESULTS:
      return {
        ...state,
        draftParcels: [...action.draftParcelList],
      };
    case actionTypes.STORE_PARCEL_FROM_MAP_EVENT:
      return {
        ...state,
        parcels: [...state.parcels.filter(parcel => parcel.id !== action.parcel.id), action.parcel],
      };
    case actionTypes.STORE_PARCEL_DETAIL:
      return {
        ...state,
        parcelDetail: action.parcelDetail,
      };
    case actionTypes.STORE_BUILDING_DETAIL:
      return {
        ...state,
        parcelDetail: action.parcelDetail,
      };
    default:
      return state;
  }
};

export default parcelsReducer;
