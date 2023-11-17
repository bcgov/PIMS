import { LegendControl } from 'components/maps/leaflet/Legend/LegendControl';
import React from 'react';
import renderer from 'react-test-renderer';

// Mocking react-leaflet to avoid having a leaflet context
jest.mock('react-leaflet', () => ({
  useMap: () => ({
    off: () => {},
    addControl: () => {},
    removeControl: () => {},
  }),
}));

describe('Testing LegendControl Component', () => {
  it('Control button renders correctly', () => {
    const tree = renderer.create(<LegendControl />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
