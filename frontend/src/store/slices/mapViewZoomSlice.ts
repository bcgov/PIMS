import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const setMapViewZoom = createAction<number>('setMapViewZoom');
export const resetMapViewZoom = createAction('resetMapViewZoom');
export const DEFAULT_MAP_ZOOM = 6;

export const mapViewZoomSlice = createSlice({
  name: 'mapViewZoom',
  initialState: DEFAULT_MAP_ZOOM,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setMapViewZoom, (_state: number, action: PayloadAction<number>) => {
      return action.payload;
    });
    builder.addCase(resetMapViewZoom, (_state: number, _action: PayloadAction<number>) => {
      return DEFAULT_MAP_ZOOM;
    });
  },
});

export default mapViewZoomSlice;
