import {
  initialMapViewState,
  mapViewZoomSlice,
  resetMapViewZoom,
  setMapViewZoom,
} from './mapViewZoomSlice';

describe('Map View slice tests', () => {
  const reducer = mapViewZoomSlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialMapViewState);
  });

  it('Should store map view zoom state', () => {
    const data = 1;
    expect(reducer(undefined, setMapViewZoom(data))).toEqual(data);
  });

  it('Should reset map view zoom state', () => {
    expect(reducer(1, resetMapViewZoom())).toEqual(initialMapViewState);
  });
});
