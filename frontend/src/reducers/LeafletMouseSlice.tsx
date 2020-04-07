import { LeafletMouseEvent } from 'leaflet';
import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveClickLatLng = createAction<LeafletMouseEvent>('saveClickLatLng');
export const clearClickLatLng = createAction('clearLatLng');
const leafletMouseSlice = createSlice({
  name: 'leafletMouseEvent',
  initialState: { mapClickEvent: null },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(saveClickLatLng, (state: any, action: any) => {
      // action is inferred correctly here with `action.payload` as a `number`
      state.mapClickEvent = action.payload;
    });
    builder.addCase(clearClickLatLng, (state: any) => {
      // action is inferred correctly here with `action.payload` as a `number`
      state.mapClickEvent = null;
    });
  },
});

export default leafletMouseSlice;
