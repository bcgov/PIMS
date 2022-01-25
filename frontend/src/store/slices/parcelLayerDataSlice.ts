import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { GeoJsonObject } from 'geojson';

export interface IParcelLayerData {
  e: MouseEvent | null;
  data: { [key: string]: any };
}

export const saveParcelLayerData = createAction<IParcelLayerData | null>('saveParcelLayerData');
export const saveParcelLayerFeature = createAction<GeoJsonObject>('saveParcelLayerFeature');
export const clearParcelLayerData = createAction('clearParcelLayerData');
export const clearParcelLayerFeature = createAction('clearParcelLayerFeature');

export interface IParcelLayerState {
  parcelLayerData: IParcelLayerData | null;
  parcelLayerFeature: GeoJsonObject | null;
}

export const initialParcelLayerState: IParcelLayerState = {
  parcelLayerData: null,
  parcelLayerFeature: null,
};

export const parcelLayerDataSlice = createSlice({
  name: 'parcelLayerData',
  initialState: initialParcelLayerState,
  reducers: {},
  extraReducers: (builder: any) => {
    // TODO: Fix any
    builder.addCase(saveParcelLayerData, (state: IParcelLayerState, action: PayloadAction<any>) => {
      !!action.payload.e?.persist && action.payload.e.persist();
      state.parcelLayerData = action.payload;
    });
    builder.addCase(clearParcelLayerData, (state: IParcelLayerState) => {
      state.parcelLayerData = null;
    });
    // TODO: Fix any
    builder.addCase(
      saveParcelLayerFeature,
      (state: IParcelLayerState, action: PayloadAction<any>) => {
        !!action.payload.e?.persist && action.payload.e.persist();
        state.parcelLayerFeature = action.payload;
      },
    );
    builder.addCase(clearParcelLayerFeature, (state: IParcelLayerState) => {
      state.parcelLayerFeature = null;
    });
  },
});

export default parcelLayerDataSlice;
