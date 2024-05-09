import usePimsApi from '@/hooks/usePimsApi';
import React, { useCallback, useEffect, useState } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import PropertyMarker from '@/components/map/markers/PropertyMarker';
import { Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import useSupercluster from 'use-supercluster';
import './clusters.css';
import L from 'leaflet';
import { BBox } from 'geojson';
import { Spiderfier } from '@/components/map/Spiderfier';

export interface InventoryLayerProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

export const InventoryLayer = (props: InventoryLayerProps) => {
  const { setLoading } = props;
  const api = usePimsApi();
  const map = useMap();
  const { data, refreshData, isLoading } = useDataLoader(api.properties.propertiesGeoSearch);
  const [properties, setProperties] = useState<PropertyGeo[]>([]);
  const [clusterBounds, setClusterBounds] = useState<BBox>();
  const [clusterZoom, setClusterZoom] = useState<number>(14);
  const maxZoom = 18;

  // Get the property data for mapping
  useEffect(() => {
    if (data && data.length > 0) {
      setProperties(data as PropertyGeo[]);
      setLoading(false);
    } else {
      setLoading(true);
      refreshData();
    }
  }, [data, isLoading]);

  // Updating the map for the clusterer
  const updateMap = () => {
    const b = map.getBounds();
    setClusterBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setClusterZoom(map.getZoom());
  };

  // Update map once upon load
  useEffect(() => {
    updateMap();
  }, []);

  // Create clustered markers
  const { clusters, supercluster } = useSupercluster({
    points: properties,
    bounds: clusterBounds,
    zoom: clusterZoom,
    options: { radius: clusterZoom * 10, maxZoom, minZoom: 0, extent: 500 },
    disableRefresh: isLoading,
  });

  // Create icons for clusters
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

  // Spiderfy clustered markers
  const spiderfier = new Spiderfier(map, {
    getClusterPoints: (clusterId) => supercluster?.getLeaves(clusterId, Infinity) ?? [],
    spiderfyDistanceMultiplier: map.getZoom() * 0.1,
  });
  const [spider, setSpider] = useState<any>({});
  const [selectedCluster, setSelectedCluster] = useState(undefined);

  // on-click handler
  const zoomOrSpiderfy = useCallback(
    (cluster: PropertyGeo & ClusterGeo) => {
      if (!supercluster || !spiderfier || !cluster) {
        return;
      }
      const expansionZoom = Math.min(
        supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
        maxZoom,
      );

      const showCluster = () => {
        const res = spiderfier.spiderfy(cluster);
        setSpider(res);
      };
      // already at maxZoom, need to spiderfy child markers
      if (expansionZoom === map.getZoom()) {
        showCluster();
      } else {
        map.setView(
          [cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]],
          expansionZoom,
          {
            animate: true,
          },
        );
      }
    },
    [map, supercluster, selectedCluster],
  );

  // Update map after these actions
  useMapEvents({
    zoomend: () => {
      updateMap();
    },
    moveend: updateMap,
    click: () => {
      spiderfier.unspiderfy();
      setSpider({});
      setSelectedCluster(undefined);
    },
  });

  return (
    <>
      {clusters.map((property: PropertyGeo & ClusterGeo) => {
        if (property.properties.cluster) {
          return (
            <Marker
              key={`cluster-${property.properties.cluster_id}`}
              position={[property.geometry.coordinates[1], property.geometry.coordinates[0]]} // Flip this back to leaflet-expected positions
              icon={fetchIcon(
                property.properties.point_count,
                10 + (property.properties.point_count / properties.length) * 40,
              )}
              eventHandlers={{
                click: () => {
                  setSelectedCluster(property);
                  zoomOrSpiderfy(property);
                },
              }}
            />
          );
        }
        // if (!spider.markers?.find((spiderMarker: PropertyGeo & ClusterGeo) => {
        //   property.geometry.coordinates[0] === spiderMarker.geometry.coordinates[0] &&
        //   property.geometry.coordinates[1] === spiderMarker.geometry.coordinates[1]
        // })){
        //   (
        //     <PropertyMarker
        //       key={`${property.properties.Id} + ${property.properties.PropertyTypeId}`}
        //       property={property}
        //     />
        //   );
        // }
        // return <></>
        return (
          <PropertyMarker
            key={`${property.properties.Id} + ${property.properties.PropertyTypeId}`}
            property={property}
          />
        );
      })}
      {spider.markers?.map(
        (
          spiderMarker: PropertyGeo &
            ClusterGeo & {
              position: {
                lat: number;
                lng: number;
              };
            },
        ) => {
          return (
            <PropertyMarker
              key={`spider-marker-${spiderMarker.properties.Id} + ${spiderMarker.properties.PropertyTypeId}`}
              property={spiderMarker}
              position={[spiderMarker.position.lat, spiderMarker.position.lng]}
            />
          );
        },
      )}
      {/**
       * Render lines/legs from a spiderfied cluster click
       */}
      {spider.lines?.map(
        (
          line: {
            coords: { lat: number; lng: number }[];
            options: { weight: number; color: string; opacity: number };
          },
          index: number,
        ) => {
          return <Polyline key={index} positions={line.coords} {...line.options} />;
        },
      )}
    </>
  );
};
