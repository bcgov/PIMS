import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import useSupercluster from 'use-supercluster';
import './clusterHelpers/clusters.css';
import L, { Point } from 'leaflet';
import { BBox } from 'geojson';
import { PopupState } from '@/components/map/clusterPopup/ClusterPopup';

export interface InventoryLayerProps {
  isLoading: boolean;
  properties: PropertyGeo[];
  popupState: PopupState;
  setPopupState: (stateUpdates: Partial<PopupState>) => void;
  tileLayerName: string;
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
  const { isLoading, properties, popupState, setPopupState, tileLayerName } = props;
  const map = useMap();
  const [clusterBounds, setClusterBounds] = useState<BBox>(); // Affects clustering
  const [clusterZoom, setClusterZoom] = useState<number>(14); // Affects clustering

  const maxZoom = 18;

  // When properties change, remake clusters
  useEffect(() => {
    if (properties) {
      if (properties.length) {
        updateClusters();
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

  // Determine appropriate class for map clusters
  const getClusterClass = useMemo(() => {
    switch (tileLayerName) {
      case 'Street Map':
        return 'street';
      case 'Satellite':
        return 'satellite';
      default:
        return '';
    }
  }, [tileLayerName]);

  // Create icons for clusters
  const icons = {};
  const makeClusterIcon = (count: number) => {
    // Only make one icon per identical count
    const size = 10 + (count / properties.length) * 20;
    if (!icons[count]) {
      const displayCount = count < 1000 ? count : `${(count / 1000).toFixed(1)}K`;
      return (icons[count] = L.divIcon({
        // Some cluster styling found in clusterHelpers/clusters.css
        html: `<div class="cluster-marker ${getClusterClass}" style="width: ${size}px; height: ${size}px;">
        ${displayCount}
      </div>`,
        iconAnchor: [size, size], // This helps to centre the icon on the location. Otherwise anchored top-left.
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
      cancelOpenPopup();

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
  let timeoutID = undefined;
  // For expanding the cluster popup
  const openClusterPopup = (cluster: PropertyGeo & ClusterGeo, point: Point) => {
    // Prevent reseting state if entering the same cluster marker
    if (popupState.open && cluster.properties.cluster_id === popupState.clusterId) {
      return;
    }
    timeoutID = setTimeout(() => {
      // If it's a cluster of more than 1
      if (cluster.properties.cluster) {
        const newClusterProperties: (PropertyGeo & ClusterGeo)[] = supercluster.getLeaves(
          cluster.properties.cluster_id, // id of cluster containing properties
          popupState.pageSize, // size of page
          popupState.pageSize * popupState.pageIndex, // offset
        );
        const totalProperties: (PropertyGeo & ClusterGeo)[] = supercluster.getLeaves(
          cluster.properties.cluster_id,
          Infinity,
        );
        setPopupState({
          properties: newClusterProperties,
          open: true,
          position: point,
          pageIndex: 0,
          total: totalProperties.length,
          supercluster: supercluster,
          clusterId: cluster.properties.cluster_id,
        });
      } else {
        // Cluster marker of 1
        setPopupState({
          properties: [cluster],
          open: true,
          position: point,
          pageIndex: 0,
          total: 1,
        });
      }
    }, 350);
  };

  const cancelOpenPopup = () => {
    clearTimeout(timeoutID);
  };

  // Update map after these actions
  useMapEvents({
    zoomend: updateClusters,
    moveend: updateClusters,
    zoomstart: () =>
      setPopupState({
        properties: [],
        open: false,
        position: new Point(0, 0),
        pageIndex: 0,
      }),
    movestart: () =>
      setPopupState({
        properties: [],
        open: false,
        position: new Point(0, 0),
        pageIndex: 0,
      }),
  });

  // Converts mouse event on clusters to a usable Point
  const convertEventToPoint = (e: MouseEvent): Point => {
    return {
      x: e.clientX,
      y: e.clientY,
    } as Point;
  };

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
                mouseover: (e) => {
                  openClusterPopup(property, convertEventToPoint(e.originalEvent));
                },
                mouseout: cancelOpenPopup,
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
                mouseover: (e) => openClusterPopup(property, convertEventToPoint(e.originalEvent)),
                mouseout: cancelOpenPopup,
              }}
            />
          );
        }
      })}
    </>
  );
};
