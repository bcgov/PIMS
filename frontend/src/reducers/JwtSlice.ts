import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveJwt = createAction<string>('saveJwt');
export const clearJwt = createAction('clearJwt');
/**
 * The following is a shorthand method for creating a reducer with paired actions and action creators.
 * All functionality related to this concept is contained within this file.
 * See https://redux-toolkit.js.org/api/createslice for more details.
 */
const jwtSlice = createSlice({
  name: 'jwt',
  initialState: '',
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveJwt, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(clearJwt, (state: any) => {
      return '';
    });
  },
});

export default jwtSlice;
