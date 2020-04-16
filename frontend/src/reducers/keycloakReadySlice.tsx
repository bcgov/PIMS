import { createSlice, createAction } from '@reduxjs/toolkit';

export const setKeycloakReady = createAction<boolean>('setKeycloakReady');

const keycloakReadySlice = createSlice({
  name: 'keycloakReady',
  initialState: false,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setKeycloakReady, (state: any, action: any) => {
      return action.payload;
    });
  },
});

export default keycloakReadySlice;
