import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const setMapViewZoom = createAction<number>('setMapViewZoom');
export const resetMapViewZoom = createAction('resetMapViewZoom');
export const DEFAULT_MAP_ZOOM = 6;

export const initialMapViewState = DEFAULT_MAP_ZOOM;

export const mapViewZoomSlice = createSlice({
  name: 'mapViewZoom',
  initialState: initialMapViewState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(setMapViewZoom, (_state: number, action: PayloadAction<number>) => {
      return action.payload;
    });
    builder.addCase(resetMapViewZoom, () => {
      return DEFAULT_MAP_ZOOM;
    });
  },
});

export default mapViewZoomSlice;
