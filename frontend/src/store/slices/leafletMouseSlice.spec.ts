import { LatLng, LeafletMouseEvent, Point } from 'leaflet';

import {
  clearClickLatLng,
  initialLeafletState,
  leafletMouseSlice,
  saveClickLatLng,
} from './leafletMouseSlice';

describe('Leaflet mouse slice tests', () => {
  const reducer = leafletMouseSlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialLeafletState);
  });

  it('Should save mouse state', () => {
    const click: LeafletMouseEvent = {
      type: 'click',
      target: {},
      sourceTarget: {},
      propagatedFrom: {},
      layer: {},
      latlng: new LatLng(0.34, 1.34),
      layerPoint: new Point(1, 2),
      containerPoint: new Point(3, 4),
      originalEvent: new MouseEvent('click'),
    };
    expect(reducer(undefined, saveClickLatLng(click))).toEqual({
      ...initialLeafletState,
      mapClickEvent: click,
    });
  });

  it('Should clear mouse state', () => {
    expect(reducer(undefined, clearClickLatLng())).toEqual(initialLeafletState);
  });
});
