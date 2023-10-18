import { render } from '@testing-library/react';
import PointClusterer from 'components/maps/leaflet/PointClusterer';
import { PointFeature } from 'components/maps/types';
import { PropertyTypes } from 'constants/propertyTypes';
import React from 'react';

const points: PointFeature[] = [
  {
    id: 0,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0],
    },
    properties: {
      id: 0,
      propertyTypeId: PropertyTypes.PARCEL,
    },
  },
  {
    id: 1,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0],
    },
    properties: {
      id: 1,
      propertyTypeId: PropertyTypes.BUILDING,
    },
  },
];

const getClusterer = () => {
  return (
    <PointClusterer
      tilesLoaded={true}
      points={points}
      draftPoints={points}
      zoom={0}
      onMarkerClick={() => {}}
    />
  );
};

describe('Testing Point Clusterer', () => {
  it('Cluster of 2 renders appropriately', async () => {
    const { container } = render(getClusterer());
    const cluster = container.querySelector('.marker-cluster');
    expect(cluster).toBeInTheDocument();
  });
});
