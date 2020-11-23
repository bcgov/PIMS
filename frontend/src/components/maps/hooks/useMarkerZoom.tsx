import { useState, useEffect } from 'react';
import {
  IPropertyDetail,
  PropertyTypes,
  storeParcelDetail,
  IParcel,
  storeBuildingDetail,
  IBuilding,
} from 'actions/parcelsActions';
import Supercluster from 'supercluster';
import { GeoJsonProperties } from 'geojson';
import { Map as LeafletMap } from 'leaflet';
import { MapProps as LeafletMapProps, Map as ReactLeafletMap } from 'react-leaflet';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

interface IUserMarkerZoom {
  mapRef: React.RefObject<ReactLeafletMap<LeafletMapProps, LeafletMap>>;
  points: Supercluster.PointFeature<{}>[];
}

/**
 * hook with providing functions to zoom into a marker.
 * @param {IUserMarkerZoom} param0
 */
const useMarkerZoom = ({ mapRef, points }: IUserMarkerZoom) => {
  const dispatch = useDispatch();
  const [zoomProperty, setZoomProperty] = useState<IPropertyDetail | null | undefined>();
  useEffect(() => {
    if (!!zoomProperty) {
      const coords: [number, number] = [
        zoomProperty.parcelDetail?.longitude || 0,
        zoomProperty.parcelDetail?.latitude || 0,
      ];
      const matchingMarkers = _.filter(points, point =>
        _.isEqual(point.geometry.coordinates, coords),
      ) as Supercluster.PointFeature<GeoJsonProperties>[];
      if (matchingMarkers.length >= 1 && (mapRef.current?.leafletElement?.getZoom() ?? 0) < 14) {
        mapRef.current?.leafletElement.flyTo({ lat: coords[1], lng: coords[0] }, 16);
      }
    }
  }, [zoomProperty, mapRef, points]);

  /**
   * Once the zoom ends, re-display the popup.
   */
  const onMarkerZoomEnd = () => {
    if (!!zoomProperty) {
      zoomProperty?.propertyTypeId === PropertyTypes.PARCEL
        ? dispatch(storeParcelDetail(zoomProperty.parcelDetail as IParcel))
        : dispatch(
            storeBuildingDetail((zoomProperty as IPropertyDetail).parcelDetail as IBuilding),
          );
      setZoomProperty(null);
    }
  };

  return { zoomProperty, setZoomProperty, onMarkerZoomEnd };
};

export default useMarkerZoom;
