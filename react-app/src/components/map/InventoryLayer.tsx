import usePimsApi from '@/hooks/usePimsApi';
import React, { useCallback, useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';

export const InventoryLayer = () => {
  const api = usePimsApi();
  const { data, refreshData, isLoading, loadOnce } = useDataLoader(api.properties.propertiesGeoSearch);
  const [properties, setProperties] = useState<PropertyGeo[]>([]);
  const [filter, setFilter] = useState({});

  // const setMarkers = useCallback(async () => {
  //   console.log('useCallback')
  //   console.log(data)
  //   await refreshData();
  //   if (data) {
  //     console.log('properties set')
  //     setProperties(data)};
  // }, [filter]);

  // useEffect(() => {
  //   console.log('useEffect')
  //   setMarkers();
  // }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setProperties(data as PropertyGeo[]);
    } else {
      refreshData();
    }
  }, [data]);

  return (
    <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds chunkInterval={100} chunkDelay={200}>
      {properties.map((property: PropertyGeo) => (
        <Marker
          key={`${property.Id} + ${property.PropertyTypeId}`}
          position={[property.Location.y, property.Location.x]}
          icon={
            new L.DivIcon({
              html: `<div><span>${property.Id}</span></div>`,
              className: `marker-cluster marker-cluster`,
              iconSize: [40, 40],
            })
          }
        />
      ))}
    </MarkerClusterGroup>
  );
};
