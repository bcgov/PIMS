import { createSlice, createAction } from '@reduxjs/toolkit';
import { IStatus } from '..';

export const saveProjectStatuses = createAction<IStatus[]>('saveProjectStatuses');
export const clearProjectStatuses = createAction('clearProjectStatuses');
/**
 * Slice to handle storage of project disposal statuses.
 */
const projectStatusesSlice = createSlice({
  name: 'projectStatuses',
  initialState: [] as IStatus[],
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveProjectStatuses, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectStatuses, (state: any) => {
      return '';
    });
  },
});

export default projectStatusesSlice;
