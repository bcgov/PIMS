import { LeafletMouseEvent } from 'leaflet';
import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const saveClickLatLng = createAction<LeafletMouseEvent>('saveClickLatLng');
export const clearClickLatLng = createAction('clearLatLng');

export interface ILeafletState {
  mapClickEvent: LeafletMouseEvent | null;
}

export const initialLeafletState: ILeafletState = {
  mapClickEvent: null,
};

export const leafletMouseSlice = createSlice({
  name: 'leafletClickEvent',
  initialState: initialLeafletState,
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(
      saveClickLatLng,
      (state: ILeafletState, action: PayloadAction<LeafletMouseEvent>) => {
        state.mapClickEvent = action.payload;
      },
    );
    builder.addCase(clearClickLatLng, (state: ILeafletState) => {
      state.mapClickEvent = null;
    });
  },
});

export default leafletMouseSlice;
