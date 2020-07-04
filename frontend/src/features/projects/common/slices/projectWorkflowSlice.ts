import { createSlice, createAction } from '@reduxjs/toolkit';
import { IStatus } from '../interfaces';

export const saveProjectStatus = createAction<IStatus>('saveProjectStatus');
export const clearProjectStatus = createAction('clearProjectStatus');
/**
 * Slice to handle storage of project worflow information for all project disposal steps.
 */
const projectWorkflowSlice = createSlice({
  name: 'projectWorkflow',
  initialState: '',
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProjectStatus, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectStatus, (state: any) => {
      return {};
    });
  },
});

export default projectWorkflowSlice;
