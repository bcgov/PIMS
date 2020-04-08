import { LeafletMouseEvent } from 'leaflet';
import { createSlice, createAction } from '@reduxjs/toolkit';

export const saveClickLatLng = createAction<LeafletMouseEvent>('saveClickLatLng');
export const clearClickLatLng = createAction('clearLatLng');
/**
 * The following is a shorthand method for creating a reducer with paired actions and action creators.
 * All functionality related to this concept is contained within this file.
 * See https://redux-toolkit.js.org/api/createslice for more details.
 */
const leafletMouseSlice = createSlice({
  name: 'leafletMouseEvent',
  initialState: { mapClickEvent: null },
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveClickLatLng, (state: any, action: any) => {
      state.mapClickEvent = action.payload;
    });
    builder.addCase(clearClickLatLng, (state: any) => {
      state.mapClickEvent = null;
    });
  },
});

export default leafletMouseSlice;
