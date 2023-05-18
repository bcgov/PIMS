import { createAction, createSlice } from '@reduxjs/toolkit';
import { IStatus } from 'features/projects/interfaces';

export const saveProjectStatuses = createAction<IStatus[]>('saveProjectStatuses');
export const clearProjectStatuses = createAction('clearProjectStatuses');
/**
 * Slice to handle storage of project disposal statuses.
 */
const projectStatusesSlice = createSlice({
  name: 'statuses',
  initialState: [] as IStatus[],
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveProjectStatuses, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectStatuses, () => {
      return '';
    });
  },
});

export default projectStatusesSlice;
