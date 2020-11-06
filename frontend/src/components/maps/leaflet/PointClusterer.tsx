import './PointClusterer.scss';

import React, { useRef, useEffect } from 'react';
import { LeafletMouseEvent, Marker } from 'leaflet';
import { GeoJSON as GeoJsonLayer, useLeaflet } from 'react-leaflet';
import { BBox } from 'geojson';
import { Spiderfier } from './Spiderfier';
import { ICluster, PointFeature } from '../types';
import { pointToLayer, zoomToCluster } from './mapUtils';
import useSupercluster from '../hooks/useSupercluster';

export type PointClustererProps = {
  points: Array<PointFeature>;
  bounds?: BBox;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  /** When you click a cluster we zoom to its bounds. Default: true */
  zoomToBoundsOnClick?: boolean;
  /** When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers. Default: true */
  spiderfyOnMaxZoom?: boolean;
  onMarkerClick?: (point: PointFeature, position?: [number, number]) => void;
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
  const ref = useRef<GeoJsonLayer>(null);
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

  // reload the geojson layer when clusters change (usually due to zoom changes)
  const reload = () => {
    const geojsonLayer = ref.current?.leafletElement;
    if (geojsonLayer) {
      geojsonLayer.clearLayers();
      geojsonLayer.addData(clusters as any);
    }
  };
  useEffect(reload, [clusters]);

  // Register event handlers to shrink and expand clusters when map is interacted with
  const componentDidMount = () => {
    if (!spiderfierRef.current) {
      spiderfierRef.current = new Spiderfier(map, {
        getClusterId: cluster => cluster?.properties?.cluster_id as number,
        getClusterPoints: clusterId => supercluster?.getLeaves(clusterId, Infinity) ?? [],
        pointToLayer: pointToLayer,
        onMarkerClick: onMarkerClick,
      });
    }

    const spiderfier = spiderfierRef.current;

    map.on('click', spiderfier.unspiderfy, spiderfier);
    map.on('zoomstart', spiderfier.unspiderfy, spiderfier);
    map.on('clear', spiderfier.unspiderfy, spiderfier);

    // cleanup function
    return function componentWillUnmount() {
      map.off('click', spiderfier.unspiderfy, spiderfier);
      map.off('zoomstart', spiderfier.unspiderfy, spiderfier);
      map.off('clear', spiderfier.unspiderfy, spiderfier);
      spiderfierRef.current = undefined;
    };
  };
  useEffect(componentDidMount, [map, onMarkerClick, supercluster]);

  // on-click handler
  const zoomOrSpiderfy = (cluster: ICluster) => {
    if (!supercluster || !spiderfierRef.current || !cluster) {
      return;
    }
    const { cluster_id } = cluster.properties;
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster_id as number),
      maxZoom as number,
    );
    // already at maxZoom, need to spiderfy child markers
    if (expansionZoom === maxZoom && spiderfyOnMaxZoom) {
      spiderfierRef.current.spiderfy(cluster);
    } else if (zoomToBoundsOnClick) {
      zoomToCluster(cluster, expansionZoom, map);
    }
  };

  const onLayerClick = (e: LeafletMouseEvent) => {
    // the point may be either a cluster or a single map pin
    const clusterOrPin = (e?.propagatedFrom as Marker)?.feature as ICluster;
    const isCluster = clusterOrPin?.properties?.cluster;

    // the user clicked on a cluster
    if (!!isCluster) {
      zoomOrSpiderfy(clusterOrPin);
    } else {
      onMarkerClick?.(clusterOrPin as PointFeature); // single pin
    }
  };

  return (
    <GeoJsonLayer
      ref={ref}
      data={clusters as any}
      pointToLayer={pointToLayer}
      onclick={onLayerClick}
    ></GeoJsonLayer>
  );
};

export default PointClusterer;
