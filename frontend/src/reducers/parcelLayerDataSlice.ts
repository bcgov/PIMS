import { createSlice, createAction } from '@reduxjs/toolkit';
import { GeoJsonObject } from 'geojson';

export interface IParcelLayerData {
  e: MouseEvent | null;
  data: { [key: string]: any };
}

export const saveParcelLayerData = createAction<IParcelLayerData>('saveParcelLayerData');
export const saveParcelLayerFeature = createAction<GeoJsonObject>('saveParcelLayerFeature');
export const clearParcelLayerData = createAction('clearParcelLayerData');
export const clearParcelLayerFeature = createAction('clearParcelLayerFeature');
/**
 * The following is a shorthand method for creating a reducer with paired actions and action creators.
 * All functionality related to this concept is contained within this file.
 * See https://redux-toolkit.js.org/api/createslice for more details.
 */
const parcelLayerDataSlice = createSlice({
  name: 'parcelLayerData',
  initialState: { parcelLayerData: null, parcelLayerFeature: null },
  reducers: {},
  extraReducers: (builder: any) => {
    // note that redux-toolkit uses immer to prevent state from being mutated.
    builder.addCase(saveParcelLayerData, (state: any, action: any) => {
      !!action?.payload?.e?.persist && action.payload.e.persist();
      state.parcelLayerData = action.payload;
    });
    builder.addCase(clearParcelLayerData, (state: any) => {
      state.parcelLayerData = null;
    });
    builder.addCase(saveParcelLayerFeature, (state: any, action: any) => {
      !!action?.payload?.e?.persist && action.payload.e.persist();
      state.parcelLayerFeature = action.payload;
    });
    builder.addCase(clearParcelLayerFeature, (state: any) => {
      state.parcelLayerFeature = null;
    });
  },
});

export default parcelLayerDataSlice;
