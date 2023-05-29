import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IStatus } from '../../interfaces';

export const saveProjectStatus = createAction<IStatus>('saveProjectStatus');
export const clearProjectStatus = createAction('clearProjectStatus');

const initialState: IStatus[] = [];

const projectWorkflowSlice = createSlice({
  name: 'projectWorkflow',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProjectStatus, (_state: IStatus[], action: PayloadAction<IStatus[]>) => {
      return action.payload;
    });
    builder.addCase(clearProjectStatus, () => {
      return [];
    });
  },
});

export default projectWorkflowSlice;
