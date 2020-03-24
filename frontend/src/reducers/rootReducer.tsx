import { combineReducers } from 'redux';
import parcelsReducer from 'reducers/parcelsReducer';
import lookupCodeReducer from 'reducers/lookupCodeReducer';
import * as reducerTypes from 'constants/reducerTypes';
import networkReducer from './networkReducer';
import accessRequestReducer from 'reducers/accessRequestReducer';
import usersReducer from './usersReducer';

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
  [reducerTypes.ACCESS_REQUEST]: accessRequestReducer,
  [reducerTypes.GET_USERS]: usersReducer,
  [reducerTypes.LOOKUP_CODE]: lookupCodeReducer,
  [reducerTypes.ADD_ACTIVATE_USER]: filteredReducer(networkReducer, reducerTypes.ADD_ACTIVATE_USER),
  [reducerTypes.ADD_REQUEST_ACCESS]: filteredReducer(
    networkReducer,
    reducerTypes.ADD_REQUEST_ACCESS,
  ),
  [reducerTypes.UPDATE_REQUEST_ACCESS_ADMIN]: filteredReducer(
    networkReducer,
    reducerTypes.UPDATE_REQUEST_ACCESS_ADMIN,
  ),
};

export const rootReducer = combineReducers(reducerObject);

export type RootState = ReturnType<typeof rootReducer>;
