import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveFilter = createAction<string>('saveFilter');
export const clearFilter = createAction('clearFilter');
/**
 * The following is a shorthand method for creating a reducer with paired actions and action creators.
 * All functionality related to this concept is contained within this file.
 * See https://redux-toolkit.js.org/api/createslice for more details.
 */
const filterSlice = createSlice({
  name: 'filter',
  initialState: {},
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveFilter, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearFilter, (state: any) => {
      return '';
    });
  },
});

export default filterSlice;
