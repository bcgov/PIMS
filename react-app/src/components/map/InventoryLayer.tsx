import usePimsApi from '@/hooks/usePimsApi';
import React, { useEffect, useState } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import PropertyMarker from '@/components/map/markers/PropertyMarker';

export interface InventoryLayerProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
        <PropertyMarker key={`${property.properties.Id} + ${property.properties.PropertyTypeId}`} property={property} />
      ))}
    </MarkerClusterGroup>
  );
};
