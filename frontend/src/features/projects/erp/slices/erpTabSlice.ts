import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveErpTab = createAction<string>('saveErpTab');
export const clearErptab = createAction('clearErpTab');

/**
 * Slice to store the current tab, ensures consistent tab display on render.
 */
const erpTabSlice = createSlice({
  name: 'erpTab',
  initialState: null,
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveErpTab, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearErptab, () => {
      return {};
    });
  },
});

export default erpTabSlice;
