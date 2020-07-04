import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveProjectApprovalTab = createAction<string>('saveProjectApprovalTab');
export const clearProjectApprovaltab = createAction('clearProjectApprovaltab');

/**
 * Slice to store the current tab, ensures consistent tab display on render.
 */
const projectApprovalTabSlice = createSlice({
  name: 'projectApprovalTab',
  initialState: 'Enhanced Referral Process',
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveProjectApprovalTab, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearProjectApprovaltab, () => {
      return {};
    });
  },
});

export default projectApprovalTabSlice;
