import { Icon, DivIcon, LatLngExpression, Layer, Marker, Map, GeoJSON } from 'leaflet';
import { ICluster } from '../types';
import { IProperty, PropertyTypes } from 'actions/parcelsActions';
import Supercluster from 'supercluster';
import { ReviewWorkflowStatus } from 'features/projects/common';

// parcel icon (green)
export const parcelIcon = new Icon({
  iconUrl: require('assets/images/marker-icon-2x-green.png'),
  shadowUrl: require('assets/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// building icon (blue)
export const buildingIcon = new Icon({
  iconUrl: require('assets/images/marker-icon-2x-blue.png'),
  shadowUrl: require('assets/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// draft parcel icon (green)
export const draftParcelIcon = new Icon({
  iconUrl: require('assets/images/marker-icon-2x-green.png'),
  shadowUrl: require('assets/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'draft',
});

// draft building icon (blue)
export const draftBuildingIcon = new Icon({
  iconUrl: require('assets/images/marker-icon-2x-blue.png'),
  shadowUrl: require('assets/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'draft',
});

// spp icon (purple)
export const sppIcon = new Icon({
  iconUrl: require('assets/images/marker-icon-2x-violet.png'),
  shadowUrl: require('assets/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// erp icon (red)
export const erpIcon = new Icon({
  iconUrl: require('assets/images/marker-icon-2x-red.png'),
  shadowUrl: require('assets/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type PointFeature = Supercluster.PointFeature<{
  propertyId: number;
  propertyTypeId: PropertyTypes;
  name?: string;
}>;

/**
 * Creates map points (in GeoJSON format) for further clustering by `supercluster`
 * @param properties
 */
export const createPoints = (properties: IProperty[]) =>
  properties.map(x => {
    return {
      type: 'Feature',
      properties: {
        cluster: false,
        propertyId: x.id,
        propertyTypeId: x.propertyTypeId,
        projectNumber: x.projectNumber,
        projectStatus: x.projectStatus,
        name: x.name,
      },
      geometry: {
        type: 'Point',
        coordinates: [x.longitude, x.latitude],
      },
    } as PointFeature;
  });

/**
 * This function defines how GeoJSON points spawn Leaflet layers on the map.
 * It is called internally by the `GeoJSON` leaflet component.
 * @param feature
 * @param latlng
 */
export const pointToLayer = (feature: ICluster, latlng: LatLngExpression): Layer => {
  const { cluster: isCluster } = feature?.properties as Supercluster.ClusterProperties;
  if (!!isCluster) {
    return createClusterMarker(feature, latlng);
  }
  // we have a single point (parcel or building) to render
  return createSingleMarker(feature, latlng);
};

/**
 * Creates a map pin for a single point; e.g. a parcel or a building
 * @param feature the geojson object
 * @param latlng the point position
 */
export const createSingleMarker = (feature: ICluster, latlng: LatLngExpression): Layer => {
  const { propertyTypeId, projectNumber, projectStatus } = feature?.properties;
  const getIconType = () => {
    if (
      [
        ReviewWorkflowStatus.ERP,
        ReviewWorkflowStatus.OnHold,
        ReviewWorkflowStatus.ApprovedForErp,
      ].includes(projectStatus)
    ) {
      return erpIcon;
    } else if (projectNumber !== undefined) {
      return sppIcon;
    } else if (propertyTypeId === PropertyTypes.PARCEL) {
      return parcelIcon;
    } else if (propertyTypeId === PropertyTypes.DRAFT_PARCEL) {
      return draftParcelIcon;
    } else if (propertyTypeId === PropertyTypes.DRAFT_BUILDING) {
      return draftBuildingIcon;
    } else {
      return buildingIcon;
    }
  };
  const icon = getIconType();
  return new Marker(latlng, { icon });
};

// Internal cache of cluster icons to avoid re-creating the same icon over and over again.
const iconsCache: Record<number, DivIcon> = {};

/**
 * Creates a marker for clusters on the map
 * @param feature the cluster geojson object
 * @param latlng the cluster position
 */
export const createClusterMarker = (feature: ICluster, latlng: LatLngExpression): Layer => {
  const {
    cluster: isCluster,
    point_count: count,
    point_count_abbreviated: displayValue,
  } = feature?.properties as Supercluster.ClusterProperties;

  if (!isCluster) {
    return (null as unknown) as Layer;
  }

  const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
  let icon: DivIcon;

  if (!iconsCache[count]) {
    iconsCache[count] = new DivIcon({
      html: `<div><span>${displayValue}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: [40, 40],
    });
  }

  icon = iconsCache[count];
  return new Marker(latlng, { icon });
};

/** Zooms to a cluster */
export const zoomToCluster = (cluster: ICluster, expansionZoom: number, map: Map) => {
  const latlng = GeoJSON.coordsToLatLng(cluster?.geometry?.coordinates as [number, number]);
  map?.setView(latlng, expansionZoom, { animate: true });
};

// we need to namespace the keys as IDs are not enough here.
// the same ID could be found on both the parcel collection and building collection
export const generateKey = (p: IProperty) =>
  `${p.propertyTypeId === 0 ? 'parcel' : 'building'}-${p.id}`;

/** Creates a IProperty object from a GeoJSON point */
export const asProperty = (point: PointFeature): IProperty => {
  const { propertyId: id, propertyTypeId, name } = point?.properties;
  const latlng = GeoJSON.coordsToLatLng(point?.geometry?.coordinates as [number, number]);
  return {
    id,
    propertyTypeId,
    latitude: latlng.lat,
    longitude: latlng.lng,
    name,
  } as IProperty;
};
