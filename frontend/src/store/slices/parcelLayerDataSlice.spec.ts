import { GeoJsonObject } from 'geojson';
import {
  clearParcelLayerData,
  clearParcelLayerFeature,
  initialParcelLayerState,
  IParcelLayerData,
  parcelLayerDataSlice,
  saveParcelLayerData,
  saveParcelLayerFeature,
} from './parcelLayerDataSlice';

describe('Parcel Layer Data slice tests', () => {
  const reducer = parcelLayerDataSlice.reducer;
  const data: IParcelLayerData = {
    e: null,
    data: {},
  };
  const feature: GeoJsonObject = {
    type: 'Point',
  };

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialParcelLayerState);
  });

  it('Should store parcel layer data', () => {
    expect(reducer(undefined, saveParcelLayerData(data))).toEqual({
      ...initialParcelLayerState,
      parcelLayerData: data,
    });
  });

  it('Should clear parcel layer data', () => {
    expect(
      reducer({ ...initialParcelLayerState, parcelLayerData: data }, clearParcelLayerData()),
    ).toEqual(initialParcelLayerState);
  });

  it('Should store parcel layer feature', () => {
    expect(reducer(undefined, saveParcelLayerFeature(feature))).toEqual({
      ...initialParcelLayerState,
      parcelLayerFeature: feature,
    });
  });

  it('Should clear parcel layer feature', () => {
    expect(
      reducer(
        { ...initialParcelLayerState, parcelLayerFeature: feature },
        clearParcelLayerFeature(),
      ),
    ).toEqual(initialParcelLayerState);
  });
});
