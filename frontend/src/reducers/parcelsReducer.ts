import { IStoreAssociatedBuildingDetail } from './../actions/parcelsActions';
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
import { PointFeature } from 'components/maps/types';

export interface IParcelState {
  parcels: IProperty[];
  draftParcels: PointFeature[];
  parcelDetail: IPropertyDetail | null;
  associatedBuildingDetail: IPropertyDetail | null;
  pid: number;
}

const initialState: IParcelState = {
  parcels: [],
  draftParcels: [],
  parcelDetail: null,
  associatedBuildingDetail: null,
  pid: 0,
};

const parcelsReducer = (
  state = initialState,
  action:
    | IStoreParcelsAction
    | IStoreDraftParcelsAction
    | IStoreParcelDetail
    | IStoreBuildingDetail
    | IStoreParcelAction
    | IStoreAssociatedBuildingDetail,
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
    case actionTypes.STORE_ASSOCIATED_BUILDING_DETAIL:
      return {
        ...state,
        associatedBuildingDetail: action.associatedBuildingDetail,
      };
    default:
      return state;
  }
};

export default parcelsReducer;
