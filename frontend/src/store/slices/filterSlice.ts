import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const saveFilter = createAction<any>('saveFilter');
export const clearFilter = createAction('clearFilter');

export const initialFilterState = {};

export const filterSlice = createSlice({
  name: 'filter',
  initialState: initialFilterState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveFilter, (_state: any, action: PayloadAction<any>) => {
      return action.payload;
    });
    builder.addCase(clearFilter, () => {
      return '';
    });
  },
});

export default filterSlice;
