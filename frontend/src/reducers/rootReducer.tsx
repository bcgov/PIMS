import { combineReducers } from 'redux';
import parcelsReducer from 'reducers/parcelsReducer';
import lookupCodeReducer from 'reducers/lookupCodeReducer';
import * as reducerTypes from 'constants/reducerTypes';

export const reducerObject = {
  [reducerTypes.PARCEL]: parcelsReducer,
  [reducerTypes.LOOKUP_CODE]: lookupCodeReducer,
};

export const rootReducer = combineReducers(reducerObject);

export type RootState = ReturnType<typeof rootReducer>;
