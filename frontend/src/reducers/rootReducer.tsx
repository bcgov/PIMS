import { combineReducers } from 'redux';
import parcelsReducer from 'reducers/parcelsReducer';
import lookupCodeReducer from 'reducers/lookupCodeReducer';
import * as reducerTypes from 'constants/reducerTypes';
import networkReducer from './networkReducer';

const filteredReducer: any = (reducer: any, name: string) => (
  state: typeof rootReducer,
  action: any,
) => {
  if (name !== action.name && state !== undefined) {
    return state;
  }
  return reducer(state, action);
};

export const reducerObject = {
  [reducerTypes.PARCEL]: parcelsReducer,
  [reducerTypes.LOOKUP_CODE]: lookupCodeReducer,
  [reducerTypes.POST_ACTIVATE_USER]: filteredReducer(
    networkReducer,
    reducerTypes.POST_ACTIVATE_USER,
  ),
  [reducerTypes.POST_REQUEST_ACCESS]: filteredReducer(
    networkReducer,
    reducerTypes.POST_REQUEST_ACCESS,
  ),
};

export const rootReducer = combineReducers(reducerObject);

export type RootState = ReturnType<typeof rootReducer>;
