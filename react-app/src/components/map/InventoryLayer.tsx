/* eslint-disable prettier/prettier */
import usePimsApi from '@/hooks/usePimsApi';
import React, { useCallback, useEffect, useState } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import PropertyMarker from '@/components/map/markers/PropertyMarker';
import { Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import useSupercluster from 'use-supercluster';
import './clusterHelpers/clusters.css';
import L, { LatLngExpression } from 'leaflet';
import { BBox } from 'geojson';
import { Spiderfier } from '@/components/map/clusterHelpers/Spiderfier';
import ControlsGroup from '@/components/map/controls/ControlsGroup';
import FilterControl from '@/components/map/controls/FilterControl';

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

/**
 * Renders an inventory layer on the map.
 *
 * @param {InventoryLayerProps} props - The props for the InventoryLayer component.
 * @returns {JSX.Element} The rendered InventoryLayer component.
 */
export const InventoryLayer = (props: InventoryLayerProps) => {
  const { setLoading } = props;
  const api = usePimsApi();
  const map = useMap();
  const [properties, setProperties] = useState<PropertyGeo[]>([]);
  const [clusterBounds, setClusterBounds] = useState<BBox>();
  const [clusterZoom, setClusterZoom] = useState<number>(14);
  const [filter, setFilter] = useState({});
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.properties.propertiesGeoSearch(filter),
  );

  const maxZoom = 18;

  // Get the property data for mapping
  useEffect(() => {
    if (data) {
      if (data.length) {
        setProperties(data as PropertyGeo[]);
        // Set map bounds based on received data. Eliminate outliers (outside BC)
        const coordsArray = (data as PropertyGeo[])
        .map((d) => [d.geometry.coordinates[1], d.geometry.coordinates[0]])
        .filter(
          (coords) =>
            coords[0] > 40 && coords[0] < 60 && coords[1] > -140 && coords[1] < -110,
        ) as LatLngExpression[]
        map.fitBounds(
          L.latLngBounds(
            coordsArray.length ? coordsArray : [
              [54.2516, -129.371],
              [49.129, -117.203],
            ]
          ),
        );
        updateClusters();
        setLoading(false);
      } else {
        // TODO: No properties found error
        setProperties([]);
        map.fitBounds([[54.2516, -129.371],
          [49.129, -117.203]],)
          setLoading(false);

      }
    } else {
      setLoading(true);
      refreshData();
    }
  }, [data, isLoading]);

  useEffect(() => {
    refreshData();
  }, [filter]);

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
    // If zooming out too far, close the spidered cluster
    if (zoom < 16) {
      setSpider({});
      setSelectedCluster(undefined);
    }
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
  const makeClusterIcon = (count, size) => {
    // Gets colour based on count of cluster
    const getColour = () => {
      const maxHue = 120; // 120 is max for a nice green
      const consideredBig = 1000; // Change this to affect how the colour scales
      const colourScore = (1 - count / consideredBig) * maxHue;
      const hue = Math.max(0, Math.min(maxHue, colourScore)).toString(10);
      return ['hsl(', hue, ',60%,70%)'].join('');
    };

    // Only make one icon per identical count
    if (!icons[count]) {
      icons[count] = L.divIcon({
        html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px; background-color: ${getColour()}; border: solid 1px white">
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
  // Track the spider object
  const [spider, setSpider] = useState<any>({});
  // Track the currently selected cluster
  const [selectedCluster, setSelectedCluster] = useState(undefined);

  // Decide if clusters should zoom or expand into spider
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
        // Zoom towards cluster
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
    zoomend: updateClusters,
    moveend: updateClusters,
  });

  return (
    <>
      <ControlsGroup position="topleft">
        <FilterControl setFilter={setFilter} />
      </ControlsGroup>
      {/* For all cluster objects */}
      {clusters.map((property: PropertyGeo & ClusterGeo) => {
        // Return a cluster circle if it's a cluster
        if (property.properties.cluster) {
          return (
            <Marker
              key={`cluster-${property.properties.cluster_id}`}
              position={[property.geometry.coordinates[1], property.geometry.coordinates[0]]} // Flip this back to leaflet-expected positions
              icon={makeClusterIcon(
                property.properties.point_count,
                10 + (property.properties.point_count / properties.length) * 40,
              )}
              eventHandlers={{
                click: () => {
                  if (spider.markers) {
                    spiderfier.unspiderfy();
                    setSpider({});
                    setSelectedCluster(undefined);
                  } else {
                    setSelectedCluster(property);
                    zoomOrSpiderfy(property);
                  }
                },
              }}
            />
          );
        }
        // Not a cluster, return a regular marker
        return (
          <PropertyMarker
            key={`${property.properties.Id} + ${property.properties.PropertyTypeId}`}
            property={property}
          />
        );
      })}
      {/* For all markers on spidered clusters, return a marker */}
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
