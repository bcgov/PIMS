import * as actionTypes from "constants/actionTypes";
import { StorePropertiesAction, StorePropertiesDetail } from "actions/propertiesActions";
import { Property, PropertyDetail } from "actions/propertiesActions";

export interface PropertyState {
  properties: Property[],
  propertyDetail: PropertyDetail | null,
  pid: number
}

const initialState: PropertyState = {
  properties: [],
  propertyDetail: null,
  pid: 0
};

const propertiesReducer = (state = initialState, action: StorePropertiesAction | StorePropertiesDetail) => {
  switch (action.type) {
    case actionTypes.STORE_PROPERTY_RESULTS:
      return {
        ...state,
        properties: [ ...action.propertyList ]
        }
    case actionTypes.STORE_PROPERTY_DETAIL:
      return {
        ...state,
        propertyDetail: action.propertyDetail
      };
    default:
      return state;
  }
};

export default propertiesReducer;
