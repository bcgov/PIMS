import { createSlice, createAction } from '@reduxjs/toolkit';

export const savePropertyNames = createAction<String[]>('savePropertyNames');
export const clearPropertyNames = createAction('clearPropertyNames');
/**
 * Slice to handle storage of property names
 */
const propertyNameSlice = createSlice({
  name: 'propertyNames',
  initialState: [] as String[],
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(savePropertyNames, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearPropertyNames, (state: any) => {
      return '';
    });
  },
});

export default propertyNameSlice;
