import React, { useCallback, useEffect, useState } from 'react';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import useSupercluster from 'use-supercluster';
import './clusterHelpers/clusters.css';
import L, { LatLngExpression } from 'leaflet';
import { BBox } from 'geojson';

export interface InventoryLayerProps {
  isLoading: boolean;
  properties: PropertyGeo[];
  setPopupProperties:  React.Dispatch<React.SetStateAction<(PropertyGeo & ClusterGeo)[]>>;
}

// Properties added to PropertyGeo types after clustering
export interface ClusterGeo {
  properties: {
    // Optionals only on clustered points.
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
  };
}

/**
 * Renders an inventory layer on the map.
 *
 * @param {InventoryLayerProps} props - The props for the InventoryLayer component.
 * @returns {JSX.Element} The rendered InventoryLayer component.
 */
export const InventoryLayer = (props: InventoryLayerProps) => {
  const { isLoading, properties, setPopupProperties } = props;
  const map = useMap();
  const [clusterBounds, setClusterBounds] = useState<BBox>(); // Affects clustering
  const [clusterZoom, setClusterZoom] = useState<number>(14); // Affects clustering

  const maxZoom = 18;

  // When properties change, set map bounds and remake clusters
  useEffect(() => {
    if (properties) {
      if (properties.length) {
        // Set map bounds based on received data. Eliminate outliers (outside BC)
        const coordsArray = properties
          .map((d) => [d.geometry.coordinates[1], d.geometry.coordinates[0]])
          .filter(
            (coords) => coords[0] > 40 && coords[0] < 60 && coords[1] > -140 && coords[1] < -110,
          ) as LatLngExpression[];
        map.fitBounds(
          L.latLngBounds(
            coordsArray.length
              ? coordsArray
              : [
                  [54.2516, -129.371],
                  [49.129, -117.203],
                ],
          ),
        );
        updateClusters();
      } else {
        // Reset back to BC view
        map.fitBounds([
          [54.2516, -129.371],
          [49.129, -117.203],
        ]);
      }
    }
  }, [properties]);

  // Updating the map for the clusterer
  const updateClusters = () => {
    const b = map.getBounds();
    setClusterBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    const zoom = map.getZoom();
    setClusterZoom(zoom);
  };

  // Update clusters once upon load
  useEffect(() => {
    updateClusters();
  }, []);

  // Create clustered markers
  const { clusters, supercluster } = useSupercluster({
    points: properties,
    bounds: clusterBounds,
    zoom: clusterZoom,
    options: { radius: 65, maxZoom, minZoom: 0, extent: 400 }, // Controls how markers cluster
    disableRefresh: isLoading, // So we don't refresh while loading
  });

  // Create icons for clusters
  const icons = {};
  const makeClusterIcon = (count: number) => {
    // Only make one icon per identical count
    const size = 10 + (count / properties.length) * 40;
    if (!icons[count]) {
      const displayCount = count < 1000 ? count : `${(count / 1000).toFixed(1)}K`;
      return (icons[count] = L.divIcon({
        html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px; background-color: rgb(120,120,120); color: white;">
        ${displayCount}
      </div>`,
      }));
    }
    return icons[count];
  };

  // Zoom towards cluster enough to break into small clusters
  const zoomOnCluster = useCallback(
    (cluster: PropertyGeo & ClusterGeo) => {
      if (!supercluster || !cluster) {
        return;
      }
      const expansionZoom = Math.min(
        supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
        maxZoom,
      );

      // Zoom towards cluster
      map.setView(
        [cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]],
        expansionZoom,
        {
          animate: true,
        },
      );
    },
    [map, supercluster],
  );

  // For expanding the cluster popup
  const openClusterPopup = (cluster: PropertyGeo & ClusterGeo) => {
    // If it's a cluster of more than 1
    if (cluster.properties.cluster) {
      const newClusterProperties: (PropertyGeo & ClusterGeo)[] = supercluster.getLeaves(
        cluster.properties.cluster_id,
        10, // size of page
        0 // offset
      );
      setPopupProperties(newClusterProperties); 
    } else {
      // Cluster marker of 1
      setPopupProperties([cluster]); 
    }
  };

  // Update map after these actions
  useMapEvents({
    zoomend: updateClusters,
    moveend: updateClusters,
  });

  return (
    <>
      {/* For all cluster objects */}
      {clusters.map((property: PropertyGeo & ClusterGeo) => {
        // Return a cluster circle if it's a cluster
        if (property.properties.cluster) {
          return (
            <Marker
              key={`cluster-${property.properties.cluster_id}`}
              position={[property.geometry.coordinates[1], property.geometry.coordinates[0]]} // Flip this back to leaflet-expected positions
              icon={makeClusterIcon(property.properties.point_count)}
              eventHandlers={{
                click: () => zoomOnCluster(property),
                mouseover: () => openClusterPopup(property),
              }}
            />
          );
        } else {
          // Cluster icons of 1
          return (
            <Marker
              key={`cluster-${property.properties.Id}`}
              position={[property.geometry.coordinates[1], property.geometry.coordinates[0]]} // Flip this back to leaflet-expected positions
              icon={makeClusterIcon(1)}
              eventHandlers={{
                click: () => {
                  // Zoom fully towards cluster of 1
                  map.setView(
                    [property.geometry.coordinates[1], property.geometry.coordinates[0]],
                    maxZoom,
                    {
                      animate: true,
                    },
                  );
                },
                mouseover: () => openClusterPopup(property),
              }}
            />
          );
        }
      })}
    </>
  );
};
