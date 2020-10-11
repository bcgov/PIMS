import { createSlice, createAction } from '@reduxjs/toolkit';

export const setMapViewZoom = createAction<number>('setMapViewZoom');
export const resetMapViewZoom = createAction('resetMapViewZoom');
export const DEFAULT_MAP_ZOOM = 6;

const mapViewZoomSlice = createSlice({
  name: 'mapViewZoom',
  initialState: DEFAULT_MAP_ZOOM,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setMapViewZoom, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(resetMapViewZoom, (state: any, action: any) => {
      return DEFAULT_MAP_ZOOM;
    });
  },
});

export default mapViewZoomSlice;
