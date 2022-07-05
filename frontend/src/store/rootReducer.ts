import projectSlice from 'features/projects/common/slices/projectSlice';
import projectStatusesSlice from 'features/projects/common/slices/projectStatusesSlice';
import projectTasksSlice from 'features/projects/common/slices/projectTasksSlice';
import projectWorkflowSlice from 'features/projects/common/slices/projectWorkflowSlice';
import ProjectWorkflowTasksSlice from 'features/projects/common/slices/projectWorkflowTasksSlice';
import propertyNameSlice from 'features/properties/common/slices/propertyNameSlice';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from 'redux';

import {
  accessRequestSlice,
  agencySlice,
  filterSlice,
  jwtSlice,
  keycloakReadySlice,
  leafletMouseSlice,
  lookupCodeSlice,
  mapViewZoomSlice,
  networkSlice,
  parcelLayerDataSlice,
  parcelSlice,
  projectSlice as disposalSlice,
  userSlice,
} from './slices';

export const reducerObject = {
  loadingBar: loadingBarReducer,
  [lookupCodeSlice.name]: lookupCodeSlice.reducer,
  [parcelSlice.name]: parcelSlice.reducer,
  [accessRequestSlice.name]: accessRequestSlice.reducer,
  [agencySlice.name]: agencySlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [networkSlice.name]: networkSlice.reducer,
  [leafletMouseSlice.name]: leafletMouseSlice.reducer,
  [parcelLayerDataSlice.name]: parcelLayerDataSlice.reducer,
  [jwtSlice.name]: jwtSlice.reducer,
  [filterSlice.name]: filterSlice.reducer,
  [keycloakReadySlice.name]: keycloakReadySlice.reducer,
  [mapViewZoomSlice.name]: mapViewZoomSlice.reducer,

  [projectWorkflowSlice.name]: projectWorkflowSlice.reducer,
  [projectTasksSlice.name]: projectTasksSlice.reducer,
  [ProjectWorkflowTasksSlice.name]: ProjectWorkflowTasksSlice.reducer,
  [projectStatusesSlice.name]: projectStatusesSlice.reducer,
  [propertyNameSlice.name]: propertyNameSlice.reducer,
  [projectSlice.name]: projectSlice.reducer,
  [disposalSlice.name]: disposalSlice.reducer,
};

export const rootReducer = combineReducers(reducerObject);
