import usePimsApi from '@/hooks/usePimsApi';
import React, { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { getMatchingPropertyPin } from '@/components/map/markers/propertyPins';

export interface InventoryLayerProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const InventoryLayer = (props: InventoryLayerProps) => {
  const { setLoading } = props;
  const api = usePimsApi();
  const { data, refreshData } = useDataLoader(api.properties.propertiesGeoSearch);
  const [properties, setProperties] = useState<PropertyGeo[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setProperties(data as PropertyGeo[]);
    } else {
      refreshData();
    }
  }, [data]);

  return (
    <MarkerClusterGroup
      chunkedLoading={true}
      removeOutsideVisibleBounds
      showCoverageOnHover
      chunkProgress={(processedMarkers: number, totalMarkers: number) => {
        if (processedMarkers === totalMarkers) {
          setLoading(false);
        } else {
          setLoading(true);
        }
      }}
    >
      {properties.map((property: PropertyGeo) => (
        <Marker
          key={`${property.Id} + ${property.PropertyTypeId}`}
          position={[property.Location.y, property.Location.x]}
          icon={getMatchingPropertyPin(property.PropertyTypeId)}
        >
          {/* TODO: Marker popup goes here */}
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};
