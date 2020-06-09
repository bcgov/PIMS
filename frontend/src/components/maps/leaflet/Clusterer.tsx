import React, { PropsWithChildren } from 'react';
import { LatLng, LeafletMouseEvent, Icon, DivIcon, Layer, Marker, GeoJSONEvent } from 'leaflet';
import { Map as LeafletMap, TileLayer, Popup, WMSTileLayer, GeoJSON } from 'react-leaflet';
import { BBox, GeoJsonProperties } from 'geojson';
import Supercluster from 'supercluster';
import useSupercluster, { ICluster } from 'hooks/useSupercluster';
import { createSingleMarker, createClusterMarker } from './mapUtils';
import { uniqueId } from 'lodash';

export type ClustererProps<P> = {
  points: Supercluster.PointFeature<P>[];
  bounds?: BBox;
  zoom: number;
  onMarkerClick?: Function;
  onClusterClick?: Function;
};

const Clusterer = <P extends GeoJsonProperties>(props: PropsWithChildren<ClustererProps<P>>) => {
  // state and refs
  const { points, bounds, zoom, onMarkerClick, onClusterClick } = props;

  // get clusters
  // clusters are an array of GeoJSON Feature objects, but some of them
  // represent a cluster of points, and some represent individual points.
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 18 },
  });

  const pointToLayer = (feature: ICluster, latlng: LatLng): Layer => {
    const { cluster: isCluster } = feature?.properties;
    // we have a cluster to render
    if (!!isCluster) {
      return createClusterMarker(feature, latlng);
    }
    // we have a single point (parcel or building) to render
    return createSingleMarker(feature, latlng);
  };

  const onClick = (e: LeafletMouseEvent) => {
    // the point may be either a cluster or a single map pin
    const cluster = (e?.layer as Marker)?.feature as ICluster;
    const isCluster = cluster?.properties?.cluster;

    // the user clicked on a cluster
    if (isCluster) {
      onClusterClick?.(cluster);
    } else {
      // the user clicked on a single map pin
      onMarkerClick?.(cluster);
    }
  };

  // TODO: improve typing
  return clusters && clusters?.length > 0 ? (
    <GeoJSON
      key={uniqueId('geojson_')}
      data={clusters as any}
      pointToLayer={pointToLayer}
      onclick={onClick}
    ></GeoJSON>
  ) : null;
};

export default Clusterer;
