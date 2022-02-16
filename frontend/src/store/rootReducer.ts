import projectSlice from 'features/projects/common/slices/projectSlice';
import projectStatusesSlice from 'features/projects/common/slices/projectStatusesSlice';
import projectTasksSlice from 'features/projects/common/slices/projectTasksSlice';
import projectWorkflowSlice from 'features/projects/common/slices/projectWorkflowSlice';
import ProjectWorkflowTasksSlice from 'features/projects/common/slices/projectWorkflowTasksSlice';
import erpTabSlice from 'features/projects/erp/slices/erpTabSlice';
import splTabSlice from 'features/projects/spl/slices/splTabSlice';
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
  [projectSlice.name]: projectSlice.reducer,
  [projectTasksSlice.name]: projectTasksSlice.reducer,
  [ProjectWorkflowTasksSlice.name]: ProjectWorkflowTasksSlice.reducer,
  [erpTabSlice.name]: erpTabSlice.reducer,
  [splTabSlice.name]: splTabSlice.reducer,
  [projectStatusesSlice.name]: projectStatusesSlice.reducer,
  [propertyNameSlice.name]: propertyNameSlice.reducer,
};

export const rootReducer = combineReducers(reducerObject);
