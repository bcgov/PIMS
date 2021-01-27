import './PointClusterer.scss';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { DivIcon, FeatureGroup as LeafletFeatureGroup } from 'leaflet';
import { useLeaflet, Marker, Polyline, Popup, FeatureGroup } from 'react-leaflet';
import { BBox } from 'geojson';
import { Spiderfier } from './Spiderfier';
import { ICluster, PointFeature } from '../types';
import { getMarkerIcon, pointToLayer, zoomToCluster } from './mapUtils';
import useSupercluster from '../hooks/useSupercluster';
import { PopupView } from '../PopupView';
import {
  IBuilding,
  IParcel,
  IPropertyDetail,
  storeParcelDetail,
  storeBuildingDetail,
  IAddress,
} from 'actions/parcelsActions';
import SelectedPropertyMarker from './SelectedPropertyMarker/SelectedPropertyMarker';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { useFilterContext } from '../providers/FIlterProvider';
import Supercluster from 'supercluster';
import { useDispatch } from 'react-redux';
import { PropertyTypes } from 'actions/parcelsActions';
import { PropertyPopUpContext } from '../providers/PropertyPopUpProvider';

export type PointClustererProps = {
  points: Array<PointFeature>;
  draftPoints: Array<PointFeature>;
  selected?: IPropertyDetail | null;
  bounds?: BBox;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  /** When you click a cluster we zoom to its bounds. Default: true */
  zoomToBoundsOnClick?: boolean;
  /** When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers. Default: true */
  spiderfyOnMaxZoom?: boolean;
  /** Action when a marker is clicked */
  onMarkerClick: () => void;
  tilesLoaded: boolean;
};

/**
 * Converts the flat list of properties into the correct type of inventory property.
 * @param property A flat list of property values (from a Feature).
 */
export const convertToProperty = (property: any): IParcel | IBuilding | null => {
  if (property.propertyTypeId === PropertyTypes.PARCEL) {
    return {
      ...property,
      address: {
        line1: property.address,
        administrativeArea: property.administrativeArea,
        province: property.province,
        postal: property.postal,
      } as IAddress,
    } as IParcel;
  } else if (property.propertyTypeId === PropertyTypes.BUILDING) {
    return {
      ...property,
      address: {
        line1: property.address,
        administrativeArea: property.administrativeArea,
        province: property.province,
        postal: property.postal,
      } as IAddress,
    } as IBuilding;
  }

  return null;
};

/**
 * Clusters pins that are close together geographically based on the zoom level into a single clustered object.
 * @param param0 Point cluster properties.
 */
export const PointClusterer: React.FC<PointClustererProps> = ({
  points,
  draftPoints,
  bounds,
  zoom,
  onMarkerClick,
  minZoom,
  maxZoom,
  selected,
  zoomToBoundsOnClick = true,
  spiderfyOnMaxZoom = true,
  tilesLoaded,
}) => {
  // state and refs
  const spiderfierRef = useRef<Spiderfier>();
  const featureGroupRef = useRef<any>();
  const draftFeatureGroupRef = useRef<any>();
  const filterState = useFilterContext();
  const dispatch = useDispatch();

  const [currentSelected, setCurrentSelected] = useState(selected);

  const [currentCluster, setCurrentCluster] = useState<
    ICluster<any, Supercluster.AnyProps> | undefined
  >(undefined);

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
  const currentClusterIds = useMemo(() => {
    if (!currentCluster?.properties?.cluster_id) {
      return [];
    }
    try {
      const points =
        supercluster?.getLeaves(currentCluster?.properties?.cluster_id, Infinity) ?? [];
      return points.map(p => p.properties.id);
    } catch (error) {
      return [];
    }
  }, [currentCluster, supercluster]);

  //Optionally create a new pin to represent the active property if not already displayed in a spiderfied cluster.
  useDeepCompareEffect(() => {
    if (!currentClusterIds.includes(+(selected?.parcelDetail?.id ?? 0))) {
      setCurrentSelected(selected);
    } else {
      setCurrentSelected(undefined);
    }
  }, [selected, setCurrentSelected]);

  // Register event handlers to shrink and expand clusters when map is interacted with
  const componentDidMount = useCallback(() => {
    if (!spiderfierRef.current) {
      spiderfierRef.current = new Spiderfier(map, {
        getClusterId: cluster => cluster?.properties?.cluster_id as number,
        getClusterPoints: clusterId => supercluster?.getLeaves(clusterId, Infinity) ?? [],
        pointToLayer: pointToLayer,
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
  }, [map, supercluster]);

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

  /**
   * Update the map bounds and zoom to make all draft properties visible.
   */
  useDeepCompareEffect(() => {
    const isDraft = draftPoints.length > 0;
    if (draftFeatureGroupRef.current && isDraft) {
      const group: LeafletFeatureGroup = draftFeatureGroupRef.current.leafletElement;
      const groupBounds = group.getBounds();

      if (groupBounds.isValid() && group.getBounds().isValid() && isDraft) {
        filterState.setChanged(false);
        map.fitBounds(group.getBounds(), { maxZoom: 16 });
      }
    }
  }, [draftFeatureGroupRef, map, draftPoints]);

  /**
   * Update the map bounds and zoom to make all property clusters visible.
   */
  useDeepCompareEffect(() => {
    if (featureGroupRef.current) {
      const group: LeafletFeatureGroup = featureGroupRef.current.leafletElement;
      const groupBounds = group.getBounds();

      if (
        groupBounds.isValid() &&
        group.getBounds().isValid() &&
        filterState.changed &&
        !selected &&
        tilesLoaded
      ) {
        filterState.setChanged(false);
        map.fitBounds(group.getBounds(), { maxZoom: 10 });
      }
      setSpider({});
      spiderfierRef.current?.unspiderfy();
    }
  }, [featureGroupRef, map, clusters, tilesLoaded]);

  const popUpContext = React.useContext(PropertyPopUpContext);
  return (
    <>
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
                  setCurrentCluster(cluster);
                  e.target.closePopup();
                }}
                icon={
                  new DivIcon({
                    html: `<div><span>${point_count_abbreviated}</span></div>`,
                    className: `marker-cluster marker-cluster-${size}`,
                    iconSize: [40, 40],
                  })
                }
              ></Marker>
            );
          }

          return (
            // render single marker, not in a cluster
            <Marker
              {...(cluster.properties as any)}
              key={index}
              position={[latitude, longitude]}
              icon={getMarkerIcon(cluster)}
              onclick={() => {
                onMarkerClick(); //open information slideout
                popUpContext.setPropertyInfo(convertToProperty(cluster.properties));
                popUpContext.setPropertyTypeID(cluster.properties.propertyTypeId);
              }}
            />
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
            onclick={() => {
              onMarkerClick(); //open information slideout
              popUpContext.setPropertyInfo(convertToProperty(m.properties));
              popUpContext.setPropertyTypeID(m.properties.propertyTypeId);
            }}
          />
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
          selected?.parcelDetail?.id === currentSelected?.parcelDetail?.id &&
          !currentClusterIds.includes(+selected?.parcelDetail?.id) && (
            <SelectedPropertyMarker
              {...selected.parcelDetail}
              icon={getMarkerIcon({ properties: selected } as any)}
              position={[
                selected.parcelDetail!.latitude as number,
                selected.parcelDetail!.longitude as number,
              ]}
              map={leaflet.map}
              onpopupclose={() => {
                selected.propertyTypeId === PropertyTypes.BUILDING &&
                  dispatch(storeBuildingDetail(null));
                selected.propertyTypeId === PropertyTypes.PARCEL &&
                  dispatch(storeParcelDetail(null));
              }}
              onclick={() => {
                popUpContext.setPropertyInfo(selected.parcelDetail);
                popUpContext.setPropertyTypeID(selected.propertyTypeId);
                onMarkerClick();
              }}
            />
          )}
      </FeatureGroup>
      <FeatureGroup ref={draftFeatureGroupRef}>
        {draftPoints.map((draftPoint, index) => {
          //render all of the unclustered draft markers.
          const [longitude, latitude] = draftPoint.geometry.coordinates;
          return (
            <Marker
              {...(draftPoint.properties as any)}
              key={index}
              position={[latitude, longitude]}
              icon={getMarkerIcon(draftPoint)}
              zIndexOffset={500}
            >
              <Popup autoPan={false}>
                <PopupView
                  propertyDetail={convertToProperty(draftPoint.properties)}
                />
              </Popup>
            </Marker>
          );
        })}
      </FeatureGroup>
    </>
  );
};

export default PointClusterer;
