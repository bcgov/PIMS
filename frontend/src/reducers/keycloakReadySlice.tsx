import { createSlice, createAction } from '@reduxjs/toolkit';

export const setKeyCloakReady = createAction<boolean>('setKeyCloakReady');

const keyCloakReadySlice = createSlice({
  name: 'keyCloakReady',
  initialState: false,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setKeyCloakReady, (state: any, action: any) => {
      return action.payload;
    });
  },
});

export default keyCloakReadySlice;
