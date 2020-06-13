import './PointClusterer.scss';

import React, { useRef, useEffect } from 'react';
import { LeafletMouseEvent, Marker, LatLngExpression } from 'leaflet';
import { GeoJSON, useLeaflet } from 'react-leaflet';
import { BBox } from 'geojson';
import Supercluster, { AnyProps } from 'supercluster';
import useSupercluster, { ICluster } from 'hooks/useSupercluster';
import { pointToLayer, zoomToCluster } from './mapUtils';
import { Spiderfier } from './Spiderfier';
import { cloneDeep } from 'lodash';

export type PointClustererProps = {
  points: Supercluster.PointFeature<AnyProps>[];
  bounds?: BBox;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  /** When you click a cluster we zoom to its bounds. Default: true */
  zoomToBoundsOnClick?: boolean;
  /** When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers. Default: true */
  spiderfyOnMaxZoom?: boolean;
  onMarkerClick?: Function;
};

export const PointClusterer: React.FC<PointClustererProps> = ({
  points,
  bounds,
  zoom,
  onMarkerClick,
  minZoom,
  maxZoom,
  zoomToBoundsOnClick = true,
  spiderfyOnMaxZoom = true,
}) => {
  // state and refs
  const ref = useRef<GeoJSON>(null);
  const spiderfierRef = useRef<Spiderfier>();
  const leaflet = useLeaflet();

  if (!leaflet || !leaflet.map) {
    throw new Error('<PointClusterer /> must be used under a <Map> leaflet component');
  }

  const map = leaflet.map;
  minZoom = minZoom ?? 0;
  maxZoom = maxZoom ?? 18;

  // get clusters
  // clusters are an array of GeoJSON Feature objects, but some of them
  // represent a cluster of points, and some represent individual points.
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 60, extent: 256, minZoom, maxZoom },
  });

  // trigger a refresh on the geojson layer when clusters change (usually due to zoom changes)
  const reloadGeoJson = () => {
    const geojsonLayer = ref.current?.leafletElement;
    if (geojsonLayer) {
      geojsonLayer.clearLayers();
      geojsonLayer.addData(clusters as any);
    }
  };
  useEffect(reloadGeoJson, [clusters]);

  // Register event handlers to shrink and expand clusters when map is interacted with
  const componentDidMount = () => {
    if (!spiderfierRef.current) {
      spiderfierRef.current = new Spiderfier(map, {
        getClusterId: (cluster: ICluster) => {
          return cluster.properties.cluster_id as number;
        },
        getClusterPoints: (cluster: ICluster) => {
          const clusterId = cluster.properties.cluster_id as number;
          const count = cluster.properties.point_count as number;
          const points = supercluster?.getLeaves(clusterId, count) || [];
          const copy = points.map(p => cloneDeep(p));
          return copy;
        },
        pointToLayer: (
          geoJsonPoint: Supercluster.PointFeature<AnyProps>,
          latlng: LatLngExpression,
        ) => {
          return pointToLayer(geoJsonPoint, latlng) as Marker;
        },
        // the user clicked on a single map pin
        onMarkerClick: (e: LeafletMouseEvent) => {
          const geojson = (e?.target as Marker)?.feature;
          onMarkerClick?.(geojson);
        },
      });
    }

    const spiderfier = spiderfierRef.current;

    map.on('click', spiderfier.unspiderfy, spiderfier);
    map.on('zoomstart', spiderfier.unspiderfy, spiderfier);

    // cleanup function
    return function componentWillUnmount() {
      map.off('click', spiderfier.unspiderfy, spiderfier);
      map.off('zoomstart', spiderfier.unspiderfy, spiderfier);
      spiderfierRef.current = undefined;
    };
  };
  useEffect(componentDidMount, [map, onMarkerClick, supercluster]);

  // on-click handler
  const zoomOrSpiderfy = (cluster: ICluster) => {
    const { cluster_id } = cluster.properties;
    const expansionZoom = Math.min(
      supercluster!.getClusterExpansionZoom(cluster_id as number),
      maxZoom as number,
    );
    // already at maxZoom, need to spiderfy child markers
    if (map.getZoom() === expansionZoom && spiderfyOnMaxZoom) {
      spiderfierRef.current?.spiderfy(cluster);
    } else if (zoomToBoundsOnClick) {
      zoomToCluster(cluster, expansionZoom, map);
    }
  };

  const onLayerClick = (e: LeafletMouseEvent) => {
    // the point may be either a cluster or a single map pin
    const cluster = (e?.propagatedFrom as Marker)?.feature as ICluster;
    const isCluster = cluster?.properties?.cluster;

    // the user clicked on a cluster
    if (!!isCluster) {
      zoomOrSpiderfy(cluster);
    } else {
      // the user clicked on a single map pin
      onMarkerClick?.(cluster);
    }
  };

  // TODO: improve typing
  return (
    <GeoJSON
      ref={ref}
      data={clusters as any}
      pointToLayer={pointToLayer}
      onclick={onLayerClick}
    ></GeoJSON>
  );
};

export default PointClusterer;
