import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveSplTab = createAction<string>('saveSplTab');
export const clearSplTab = createAction('clearSplTab');

/**
 * Slice to store the current tab, ensures consistent tab display on render.
 */
const splTabSlice = createSlice({
  name: 'splTab',
  initialState: null,
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveSplTab, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearSplTab, () => {
      return {};
    });
  },
});

export default splTabSlice;
