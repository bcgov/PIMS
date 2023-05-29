import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const saveJwt = createAction<string>('saveJwt');
export const clearJwt = createAction('clearJwt');

export const initialJwtState = '';

export const jwtSlice = createSlice({
  name: 'jwt',
  initialState: initialJwtState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveJwt, (_state: any, action: PayloadAction<any>) => {
      return action.payload;
    });
    builder.addCase(clearJwt, () => {
      return '';
    });
  },
});

export default jwtSlice;
