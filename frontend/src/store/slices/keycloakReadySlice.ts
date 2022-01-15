import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const setKeycloakReady = createAction<boolean>('setKeycloakReady');

export const keycloakReadySlice = createSlice({
  name: 'keycloakReady',
  initialState: false,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setKeycloakReady, (_state: any, action: PayloadAction<any>) => {
      return action.payload;
    });
  },
});

export default keycloakReadySlice;
