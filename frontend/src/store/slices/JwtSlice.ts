import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const saveJwt = createAction<string>('saveJwt');
export const clearJwt = createAction('clearJwt');

export const jwtSlice = createSlice({
  name: 'jwt',
  initialState: '',
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveJwt, (_state: any, action: PayloadAction<any>) => {
      return action.payload;
    });
    builder.addCase(clearJwt, (_state: any) => {
      return '';
    });
  },
});

export default jwtSlice;
