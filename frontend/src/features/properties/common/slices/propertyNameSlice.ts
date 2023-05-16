import { createAction, createSlice } from '@reduxjs/toolkit';

export const savePropertyNames = createAction<string[]>('savePropertyNames');
export const clearPropertyNames = createAction('clearPropertyNames');
/**
 * Slice to handle storage of property names
 */
const propertyNameSlice = createSlice({
  name: 'propertyNames',
  initialState: [] as string[],
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(savePropertyNames, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearPropertyNames, () => {
      return '';
    });
  },
});

export default propertyNameSlice;
