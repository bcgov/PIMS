import usePimsApi from '@/hooks/usePimsApi';
import React, { useCallback, useEffect, useState } from 'react';
import { Marker, Polygon, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { CircularProgress } from '@mui/material';
import { parcelIcon } from '@/components/map/markers/propertyPins';

export const InventoryLayer = () => {
  const api = usePimsApi();
  const map = useMap();
  const { data, refreshData } = useDataLoader(api.properties.propertiesGeoSearch);
  const [properties, setProperties] = useState<PropertyGeo[]>([]);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    if (data && data.length > 0) {
      setProperties(data as PropertyGeo[]);
    } else {
      refreshData();
    }
  }, [data]);

  useEffect(() => {
    refreshData();
  }, [filter]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      removeOutsideVisibleBounds
      chunkInterval={100}
      chunkDelay={1000}
      showCoverageOnHover={false}
    >
      {properties.map((property: PropertyGeo) => (
        <Marker
          key={`${property.Id} + ${property.PropertyTypeId}`}
          position={[property.Location.y, property.Location.x]}
          icon={parcelIcon}
        >
          {/* TODO: Marker popup goes here */}
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};
