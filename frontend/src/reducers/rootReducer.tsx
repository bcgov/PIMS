import { combineReducers } from "redux";
import parcelsReducer from "reducers/parcelsReducer";
import * as reducerTypes from "constants/reducerTypes";

export const reducerObject = {
  [reducerTypes.PARCEL]: parcelsReducer
};

export const rootReducer = combineReducers(reducerObject);

export type RootState = ReturnType<typeof rootReducer>
