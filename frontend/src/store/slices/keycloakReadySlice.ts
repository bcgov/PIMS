import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const setKeycloakReady = createAction<boolean>('setKeycloakReady');

export const initialKeycloakState = false;

export const keycloakReadySlice = createSlice({
  name: 'keycloakReady',
  initialState: initialKeycloakState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setKeycloakReady, (_state: boolean, action: PayloadAction<boolean>) => {
      return action.payload;
    });
  },
});

export default keycloakReadySlice;
