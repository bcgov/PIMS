import './PointClusterer.scss';

import { IAddress, IBuilding, IParcel, IProperty, IPropertyDetail } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import { MAX_ZOOM } from 'constants/strings';
import { BBox } from 'geojson';
import { useApi } from 'hooks/useApi';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import L from 'leaflet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FeatureGroup, Marker, Polyline, useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storePropertyDetail } from 'store/slices/parcelSlice';
import Supercluster from 'supercluster';

import useSupercluster from '../hooks/useSupercluster';
import { useFilterContext } from '../providers/FIlterProvider';
import { PropertyPopUpContext } from '../providers/PropertyPopUpProvider';
import { ICluster, PointFeature } from '../types';
import { getMarkerIcon, pointToLayer, zoomToCluster } from './mapUtils';
import SelectedPropertyMarker from './SelectedPropertyMarker/SelectedPropertyMarker';
import { Spiderfier } from './Spiderfier';

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
export const convertToProperty = (
  property: any,
  latitude?: number,
  longitude?: number,
): IParcel | IBuilding | null => {
  if ([PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(property.propertyTypeId)) {
    return {
      ...property,
      evaluations: property.evaluations ?? [],
      fiscals: property.fiscals ?? [],
      latitude: latitude,
      longitude: longitude,
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
      totalArea: property.totalArea ?? 0,
      latitude: latitude,
      longitude: longitude,
      evaluations: property.evaluations ?? [],
      fiscals: property.fiscals ?? [],
      address: {
        line1: property.address,
        administrativeArea: property.administrativeArea,
        province: property.province,
        postal: property.postal,
      } as IAddress,
    } as IBuilding;
  } else if (
    [PropertyTypes.DRAFT_BUILDING, PropertyTypes.DRAFT_PARCEL].includes(property.propertyTypeId)
  ) {
    return property;
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
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const draftFeatureGroupRef = useRef<L.FeatureGroup>(null);
  const filterState = useFilterContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const parcelId = queryParams.get('parcelId');
  const buildingId = queryParams.get('buildingId');

  const [currentSelected, setCurrentSelected] = useState(selected);
  const [currentCluster, setCurrentCluster] = useState<
    ICluster<any, Supercluster.AnyProps> | undefined
  >(undefined);

  const mapInstance: L.Map = useMap();
  if (!mapInstance) {
    throw new Error('<PointClusterer /> must be used under a <Map> leaflet component');
  }

  minZoom = minZoom ?? 0;
  maxZoom = maxZoom ?? 18;

  const [spider, setSpider] = useState<any>({});

  // get clusters
  // clusters are an array of GeoJSON Feature objects, but some of them
  // represent a cluster of points, and some represent individual points.
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 60, extent: 256, minZoom, maxZoom, enableClustering: !filterState.changed },
  });
  const currentClusterIds = useMemo(() => {
    if (!currentCluster?.properties?.cluster_id) {
      return [];
    }
    try {
      const points =
        supercluster?.getLeaves(currentCluster?.properties?.cluster_id, Infinity) ?? [];
      return points.map((p) => p.properties.id);
    } catch (error) {
      return [];
    }
  }, [currentCluster, supercluster]);

  //Optionally create a new pin to represent the active property if not already displayed in a spiderfied cluster.
  useDeepCompareEffect(() => {
    if (!currentClusterIds.includes(+(selected?.parcelDetail?.id ?? 0))) {
      setCurrentSelected(selected);
      if (!!parcelId && !!selected?.parcelDetail) {
        mapInstance.setView(
          [selected?.parcelDetail?.latitude as number, selected?.parcelDetail?.longitude as number],
          Math.max(MAX_ZOOM, mapInstance.getZoom()),
        );
      }
    } else {
      setCurrentSelected(undefined);
    }
  }, [selected, setCurrentSelected]);

  // Register event handlers to shrink and expand clusters when map is interacted with
  const componentDidMount = useCallback(() => {
    if (!spiderfierRef.current) {
      spiderfierRef.current = new Spiderfier(mapInstance, {
        getClusterId: (cluster) => cluster?.properties?.cluster_id as number,
        getClusterPoints: (clusterId) => supercluster?.getLeaves(clusterId, Infinity) ?? [],
        pointToLayer: pointToLayer,
      });
    }
    const spiderfier = spiderfierRef.current;

    mapInstance.on('click', spiderfier.unspiderfy, spiderfier);
    mapInstance.on('zoomstart', spiderfier.unspiderfy, spiderfier);
    mapInstance.on('clear', spiderfier.unspiderfy, spiderfier);

    // cleanup function
    return function componentWillUnmount() {
      mapInstance.off('click', spiderfier.unspiderfy, spiderfier);
      mapInstance.off('zoomstart', spiderfier.unspiderfy, spiderfier);
      mapInstance.off('clear', spiderfier.unspiderfy, spiderfier);
      spiderfierRef.current = undefined;
    };
  }, [mapInstance, supercluster]);

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
        if (res.markers === undefined) {
          setCurrentCluster(undefined);
        } else {
          setCurrentCluster(cluster);
        }
      } else if (zoomToBoundsOnClick) {
        zoomToCluster(cluster, expansionZoom, mapInstance);
      }
    },
    [spiderfierRef, mapInstance, maxZoom, spiderfyOnMaxZoom, supercluster, zoomToBoundsOnClick],
  );

  /**
   * Update the map bounds and zoom to make all draft properties visible.
   */
  useDeepCompareEffect(() => {
    const isDraft = draftPoints.length > 0;
    if (draftFeatureGroupRef.current && isDraft) {
      const group: L.FeatureGroup = draftFeatureGroupRef.current;
      const groupBounds = group.getBounds();

      if (groupBounds.isValid() && isDraft) {
        filterState.setChanged(false);
        mapInstance.fitBounds(groupBounds, { maxZoom: zoom > MAX_ZOOM ? zoom : MAX_ZOOM });
      }
    }
  }, [draftFeatureGroupRef, mapInstance, draftPoints]);

  /**
   * Update the map bounds and zoom to make all property clusters visible.
   */
  useDeepCompareEffect(() => {
    if (featureGroupRef.current) {
      const group: L.FeatureGroup = featureGroupRef.current;
      const groupBounds = group.getBounds();

      if (groupBounds.isValid() && filterState.changed && !selected?.parcelDetail && tilesLoaded) {
        filterState.setChanged(false);
        mapInstance.fitBounds(groupBounds, { maxZoom: zoom > MAX_ZOOM ? zoom : MAX_ZOOM });
      }

      setSpider({});
      spiderfierRef.current?.unspiderfy();
      setCurrentCluster(undefined);
    }
  }, [featureGroupRef, mapInstance, clusters, tilesLoaded]);

  const popUpContext = React.useContext(PropertyPopUpContext);

  const dispatch = useDispatch();
  const { getParcel, getBuilding } = useApi();
  const fetchProperty = React.useCallback(
    (propertyTypeId: number, id: number) => {
      popUpContext.setLoading(true);
      if ([PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(propertyTypeId)) {
        getParcel(id as number)
          .then((parcel) => {
            popUpContext.setPropertyInfo(parcel);
          })
          .catch(() => {
            toast.error('Unable to load property details, refresh the page and try again.');
          })
          .finally(() => {
            popUpContext.setLoading(false);
          });
      } else if (propertyTypeId === PropertyTypes.BUILDING) {
        getBuilding(id as number)
          .then((building) => {
            popUpContext.setPropertyInfo(building);
            if (!!building.parcels.length) {
              dispatch(
                storePropertyDetail({
                  propertyTypeId: PropertyTypes.BUILDING,
                  parcelDetail: building,
                }),
              );
            }
          })
          .catch(() => {
            toast.error('Unable to load property details, refresh the page and try again.');
          })
          .finally(() => {
            popUpContext.setLoading(false);
          });
      }
    },
    [getParcel, popUpContext, getBuilding, dispatch],
  );

  const keycloak = useKeycloakWrapper();

  return (
    <>
      <FeatureGroup ref={featureGroupRef}>
        {/**
         * Render all visible clusters
         */}
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
                eventHandlers={{
                  click: (e) => {
                    zoomOrSpiderfy(cluster);
                    e.target.closePopup();
                  },
                }}
                icon={
                  new L.DivIcon({
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
              eventHandlers={{
                click: () => {
                  const convertedProperty = convertToProperty(
                    cluster.properties,
                    latitude,
                    longitude,
                  );
                  //sets this pin as currently selected
                  if (
                    cluster.properties.propertyTypeId === PropertyTypes.PARCEL ||
                    cluster.properties.propertyTypeId === PropertyTypes.SUBDIVISION
                  ) {
                    dispatch(
                      storePropertyDetail({
                        propertyTypeId: PropertyTypes.PARCEL,
                        parcelDetail: convertedProperty as IParcel,
                      }),
                    );
                  } else {
                    dispatch(
                      storePropertyDetail({
                        propertyTypeId: PropertyTypes.BUILDING,
                        parcelDetail: convertedProperty as IBuilding,
                      }),
                    );
                  }
                  if (keycloak.canUserViewProperty(cluster.properties as IProperty)) {
                    fetchProperty(cluster.properties.propertyTypeId, cluster.properties.id);
                  } else {
                    popUpContext.setPropertyInfo(convertedProperty);
                  }
                  popUpContext.setPropertyTypeID(cluster.properties.propertyTypeId);
                  onMarkerClick(); //open information slideout
                },
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
            //highlight pin if currently selected
            icon={getMarkerIcon(
              m,
              (m.properties.id as number) === (selected?.parcelDetail?.id as number),
            )}
            eventHandlers={{
              click: () => {
                //sets this pin as currently selected
                const convertedProperty = convertToProperty(
                  m.properties,
                  m.geometry.coordinates[1],
                  m.geometry.coordinates[0],
                );
                if (
                  m.properties.propertyTypeId === PropertyTypes.PARCEL ||
                  m.properties.propertyTypeId === PropertyTypes.SUBDIVISION
                ) {
                  dispatch(
                    storePropertyDetail({
                      propertyTypeId: PropertyTypes.PARCEL,
                      parcelDetail: convertedProperty as IParcel,
                    }),
                  );
                } else {
                  dispatch(
                    storePropertyDetail({
                      propertyTypeId: PropertyTypes.BUILDING,
                      parcelDetail: convertedProperty as IBuilding,
                    }),
                  );
                }
                if (keycloak.canUserViewProperty(m.properties as IProperty)) {
                  fetchProperty(m.properties.propertyTypeId, m.properties.id);
                } else {
                  popUpContext.setPropertyInfo(
                    convertToProperty(m.properties, m.position.lat, m.position.lng),
                  );
                }
                popUpContext.setPropertyTypeID(m.properties.propertyTypeId);
                onMarkerClick(); //open information slideout
              },
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
              icon={getMarkerIcon({ properties: selected } as any, true)}
              className={
                Number(parcelId ?? buildingId) === selected?.parcelDetail?.id
                  ? 'active-selected'
                  : ''
              }
              position={[
                selected.parcelDetail!.latitude as number,
                selected.parcelDetail!.longitude as number,
              ]}
              map={mapInstance}
              eventHandlers={{
                click: () => {
                  popUpContext.setPropertyInfo(selected.parcelDetail);
                  popUpContext.setPropertyTypeID(selected.propertyTypeId ?? 0);
                  onMarkerClick();
                },
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
            />
          );
        })}
      </FeatureGroup>
    </>
  );
};

export default PointClusterer;
