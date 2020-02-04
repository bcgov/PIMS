import { combineReducers } from "redux";
import propertiesReducer from "reducers/propertiesReducer";
import * as reducerTypes from "constants/reducerTypes";

export const reducerObject = {
  [reducerTypes.PROPERTY]: propertiesReducer
};

export const rootReducer = combineReducers(reducerObject);

export type RootState = ReturnType<typeof rootReducer>
