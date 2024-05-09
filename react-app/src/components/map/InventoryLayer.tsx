import usePimsApi from '@/hooks/usePimsApi';
import React, { useEffect, useState } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import PropertyMarker from '@/components/map/markers/PropertyMarker';
import { Marker, useMap } from 'react-leaflet';
import useSupercluster from 'use-supercluster';
import './clusters.css';
import L from 'leaflet';
import { BBox } from 'geojson';

export interface InventoryLayerProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ClusterGeo {
  properties: {
    // Optionals only on clustered points.
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
  };
}

export const InventoryLayer = (props: InventoryLayerProps) => {
  const { setLoading } = props;
  const api = usePimsApi();
  const map = useMap();
  const { data, refreshData, isLoading } = useDataLoader(api.properties.propertiesGeoSearch);
  const [properties, setProperties] = useState<PropertyGeo[]>([]);
  const [clusterBounds, setClusterBounds] = useState<BBox>();
  const [clusterZoom, setClusterZoom] = useState<number>(14);


  useEffect(() => {
    if (data && data.length > 0) {
      setProperties(data as PropertyGeo[]);
      setLoading(false);
    } else {
      setLoading(true);
      refreshData();
    }
  }, [data, isLoading]);

  function updateMap() {
    const b = map.getBounds();
    setClusterBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat
    ]);
    setClusterZoom(map.getZoom());
  }

  useEffect(() => {
    updateMap();
  }, []);

  map.addEventListener('zoom', () => updateMap())
  map.addEventListener('move', () => updateMap())


  const { clusters, supercluster } = useSupercluster({
    points: properties,
    bounds: clusterBounds,
    zoom: clusterZoom,
    options: { radius: clusterZoom * 10, maxZoom: 18 },
    disableRefresh: isLoading,
  });

  const icons = {};
  const fetchIcon = (count, size) => {
    if (!icons[count]) {
      icons[count] = L.divIcon({
        html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
      });
    }
    return icons[count];
  };

  return (
    <>
      {clusters.map((property: PropertyGeo & ClusterGeo) => {
        return property.properties.cluster ? (
          <Marker
            key={`cluster-${property.properties.cluster_id}`}
            position={[property.geometry.coordinates[1], property.geometry.coordinates[0]]} // Flip this back to leaflet-expected positions
            icon={fetchIcon(
              property.properties.point_count,
              10 + (property.properties.point_count / properties.length) * 40,
            )}
            eventHandlers={{
              click: () => {
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(property.properties.cluster_id),
                  18,
                );
                map.setView([property.geometry.coordinates[1], property.geometry.coordinates[0]], expansionZoom, {
                  animate: true,
                });
                updateMap();
              },
            }}
          />
        ) : (
          <PropertyMarker
            key={`${property.properties.Id} + ${property.properties.PropertyTypeId}`}
            property={property}
          />
        );
      })}
    </>
  );
};
