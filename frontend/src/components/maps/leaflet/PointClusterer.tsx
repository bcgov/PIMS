import './PointClusterer.scss';

import React, { PropsWithChildren, useRef, useEffect } from 'react';
import { LeafletMouseEvent, Marker } from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import { BBox, GeoJsonProperties } from 'geojson';
import Supercluster from 'supercluster';
import useSupercluster, { ICluster } from 'hooks/useSupercluster';
import { pointToLayer } from './mapUtils';

export type PointClustererProps<P> = {
  points: Supercluster.PointFeature<P>[];
  bounds?: BBox;
  zoom: number;
  onMarkerClick?: Function;
  onClusterClick?: Function;
};

const PointClusterer = <P extends GeoJsonProperties>(
  props: PropsWithChildren<PointClustererProps<P>>,
) => {
  // state and refs
  const { points, bounds, zoom, onMarkerClick, onClusterClick } = props;
  const ref = useRef<GeoJSON>(null);

  // get clusters
  // clusters are an array of GeoJSON Feature objects, but some of them
  // represent a cluster of points, and some represent individual points.
  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 60, extent: 256, maxZoom: 18 },
  });

  useEffect(() => {
    // TODO: Improve typing
    const geojsonLayer = ref.current?.leafletElement;
    if (geojsonLayer) {
      geojsonLayer.clearLayers();
      geojsonLayer.addData(clusters as any);
    }
  }, [clusters]);

  const onClick = (e: LeafletMouseEvent) => {
    // the point may be either a cluster or a single map pin
    const cluster = (e?.layer as Marker)?.feature as ICluster;
    const isCluster = cluster?.properties?.cluster;

    // the user clicked on a cluster
    if (!!isCluster) {
      onClusterClick?.(cluster);
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
      onclick={onClick}
    ></GeoJSON>
  );
};

export default PointClusterer;
