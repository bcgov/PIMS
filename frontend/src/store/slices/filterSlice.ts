import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const saveFilter = createAction<any>('saveFilter');
export const clearFilter = createAction('clearFilter');

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {},
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveFilter, (_state: any, action: PayloadAction<any>) => {
      return action.payload;
    });
    builder.addCase(clearFilter, (_state: any) => {
      return '';
    });
  },
});

export default filterSlice;
