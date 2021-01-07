import './PointClusterer.scss';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DivIcon, FeatureGroup as LeafletFeatureGroup } from 'leaflet';
import { useLeaflet, Marker, Polyline, Popup, FeatureGroup } from 'react-leaflet';
import { BBox } from 'geojson';
import { Spiderfier } from './Spiderfier';
import { ICluster, PointFeature } from '../types';
import { getMarkerIcon, pointToLayer, zoomToCluster } from './mapUtils';
import useSupercluster from '../hooks/useSupercluster';
import { PopupView } from '../PopupView';
import { IPropertyDetail } from 'actions/parcelsActions';
import SelectedPropertyMarker from './SelectedPropertyMarker/SelectedPropertyMarker';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { useFilterContext } from '../providers/FIlterProvider';

export type PointClustererProps = {
  points: Array<PointFeature>;
  selected?: IPropertyDetail | null;
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
  selected,
  zoomToBoundsOnClick = true,
  spiderfyOnMaxZoom = true,
}) => {
  // state and refs
  const spiderfierRef = useRef<Spiderfier>();
  const featureGroupRef = useRef<any>();
  const filterState = useFilterContext();

  const [currentSelected, setCurrentSelected] = useState(selected);
  useDeepCompareEffect(() => {
    setCurrentSelected(selected);
  }, [selected, setCurrentSelected]);

  const leaflet = useLeaflet();
  const [spider, setSpider] = useState<any>({});
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

  // Register event handlers to shrink and expand clusters when map is interacted with
  const componentDidMount = useCallback(() => {
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
  }, [map, onMarkerClick, supercluster]);

  useEffect(componentDidMount, [componentDidMount]);

  // on-click handler
  const zoomOrSpiderfy = useCallback(
    (cluster: ICluster) => {
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
        const res = spiderfierRef.current.spiderfy(cluster);
        setSpider(res);
      } else if (zoomToBoundsOnClick) {
        zoomToCluster(cluster, expansionZoom, map);
      }
    },
    [spiderfierRef, map, maxZoom, spiderfyOnMaxZoom, supercluster, zoomToBoundsOnClick],
  );

  useDeepCompareEffect(() => {
    if (featureGroupRef.current) {
      const group: LeafletFeatureGroup = featureGroupRef.current.leafletElement;
      const groupBounds = group.getBounds();

      if (groupBounds.isValid() && group.getBounds().isValid() && filterState.changed) {
        filterState.setChanged(false);
        map.fitBounds(group.getBounds(), { maxZoom: 10 });
      }
    }
  }, [featureGroupRef, map, clusters]);

  return (
    <FeatureGroup ref={featureGroupRef}>
      {clusters.map((cluster, index) => {
        // every cluster point has coordinates
        const [longitude, latitude] = cluster.geometry.coordinates;

        const {
          cluster: isCluster,
          point_count: pointCount,
          point_count_abbreviated,
        } = cluster.properties as any;
        const size = pointCount < 100 ? 'small' : pointCount < 1000 ? 'medium' : 'large';

        // we have a cluster to render
        if (isCluster) {
          return (
            // render the cluster marker
            <Marker
              key={index}
              position={[latitude, longitude]}
              onclick={(e: any) => {
                zoomOrSpiderfy(cluster);
                e.target.closePopup();
              }}
              icon={
                new DivIcon({
                  html: `<div><span>${point_count_abbreviated}</span></div>`,
                  className: `marker-cluster marker-cluster-${size}`,
                  iconSize: [40, 40],
                })
              }
            />
          );
        }

        return (
          // render single marker, not in a cluster
          <Marker
            {...(cluster.properties as any)}
            key={index}
            position={[latitude, longitude]}
            icon={getMarkerIcon(cluster)}
          >
            <Popup autoPan={false}>
              <PopupView
                propertyTypeId={cluster.properties.propertyTypeId}
                propertyDetail={cluster.properties as any}
                onLinkClick={() => {
                  setSpider({});
                  !!onMarkerClick && onMarkerClick(cluster as any);
                }}
              />
            </Popup>
          </Marker>
        );
      })}

      {/**
       * Render markers from a spiderfied cluster click
       */}
      {spider.markers?.map((m: any, index: number) => (
        <Marker
          {...(m.properties as any)}
          key={index}
          position={m.position}
          icon={getMarkerIcon(m)}
        >
          <Popup autoPan={false}>
            <PopupView
              propertyTypeId={m.properties.propertyTypeId}
              propertyDetail={m.properties}
              onLinkClick={() => {
                setSpider({});
                !!onMarkerClick && onMarkerClick(m as any);
              }}
            />
          </Popup>
        </Marker>
      ))}
      {/**
       * Render lines/legs from a spiderfied cluster click
       */}
      {spider.lines?.map((m: any, index: number) => (
        <Polyline key={index} positions={m.coords} {...m.options} />
      ))}
      {/**
       * render selected property marker, auto opens the property popup
       */}
      {!!selected?.parcelDetail &&
        selected?.parcelDetail?.id === currentSelected?.parcelDetail?.id && (
          <SelectedPropertyMarker
            {...selected.parcelDetail}
            icon={getMarkerIcon({ properties: selected } as any)}
            position={[
              selected.parcelDetail!.latitude as number,
              selected.parcelDetail!.longitude as number,
            ]}
            map={leaflet.map}
          >
            <Popup autoPan={false}>
              <PopupView
                propertyTypeId={selected.propertyTypeId}
                propertyDetail={selected.parcelDetail}
                zoomTo={() =>
                  leaflet.map?.flyTo(
                    [
                      selected.parcelDetail!.latitude as number,
                      selected.parcelDetail!.longitude as number,
                    ],
                    14,
                  )
                }
              />
            </Popup>
          </SelectedPropertyMarker>
        )}
    </FeatureGroup>
  );
};

export default PointClusterer;
