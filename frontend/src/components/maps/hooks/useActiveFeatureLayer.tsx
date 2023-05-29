import { IPropertyDetail } from 'actions/parcelsActions';
import { GeoJsonObject } from 'geojson';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { GeoJSON, geoJSON, LatLng, Map as LeafletMap } from 'leaflet';
import { useState } from 'react';
import { useAppSelector } from 'store';

import {
  parcelLayerPopupConfig,
  PARCELS_PUBLIC_LAYER_URL,
  useLayerQuery,
} from '../leaflet/LayerPopup';
import { LayerPopupInformation } from '../leaflet/Map';
import { PointFeature } from '../types';

interface IUseActiveParcelMapLayer {
  /** the current leaflet map reference. This hook will add layers to this map reference. */
  mapRef: React.RefObject<LeafletMap>;
  /** The currently selected property on the map */
  selectedProperty?: IPropertyDetail | null;
  /** the currently displayed layer popup information */
  layerPopup?: LayerPopupInformation;
  /** set the display of the layer popup imperatively */
  setLayerPopup: (value: React.SetStateAction<LayerPopupInformation | undefined>) => void;
  /** the most recently searched for parcel layer feature */
  parcelLayerFeature?: GeoJsonObject | null;
}

/**
 * Set the currently active feature based off of the most recent click on a map layer.
 * @param param0
 */
const useActiveFeatureLayer = ({
  selectedProperty,
  mapRef,
  layerPopup,
  setLayerPopup,
  parcelLayerFeature,
}: IUseActiveParcelMapLayer) => {
  const [activeFeatureLayer, setActiveFeatureLayer] = useState<GeoJSON>();
  const parcelsService = useLayerQuery(PARCELS_PUBLIC_LAYER_URL);
  const draftProperties: PointFeature[] = useAppSelector((store) => store.parcel.draftProperties);
  if (!!mapRef.current && !activeFeatureLayer) {
    setActiveFeatureLayer(geoJSON().addTo(mapRef.current));
  }
  /**
   * if the layerPopup is currently being displayed, set the active feature to be the data displayed by the layerPopup.
   */
  useDeepCompareEffect(() => {
    if (!!activeFeatureLayer) {
      activeFeatureLayer.clearLayers();
      layerPopup?.feature && activeFeatureLayer.addData(layerPopup.feature);
    }
  }, [layerPopup, activeFeatureLayer]);

  /**
   * Other areas of the application may kick off parcel layer requests, if so, display the last request tracked in redux.
   */
  useDeepCompareEffect(() => {
    if (!!activeFeatureLayer && !!parcelLayerFeature) {
      activeFeatureLayer.clearLayers();
      activeFeatureLayer.addData(parcelLayerFeature);
      const coords = (parcelLayerFeature as any)?.geometry?.coordinates;
      if (coords && coords.length === 1 && coords[0].length > 1 && coords[0][0].length > 1) {
        const latLng = {
          lat: (parcelLayerFeature as any)?.geometry?.coordinates[0][0][1],
          lng: (parcelLayerFeature as any)?.geometry?.coordinates[0][0][0],
        };
        const center = geoJSON((parcelLayerFeature as any).geometry)
          .getBounds()
          .getCenter();

        mapRef.current?.panTo(latLng);
        setLayerPopup({
          title: 'Parcel Information',
          data: (parcelLayerFeature as any).properties,
          config: parcelLayerPopupConfig,
          latlng: latLng,
          center,
          parcelLayerFeature,
        } as any);
      }
    }
  }, [parcelLayerFeature, activeFeatureLayer]);

  /**
   * If there is a selected property on the map, attempt to retrieve the corresponding parcel. If we find matching parcel data, use that to draw the active parcel.
   * Note: currently this is limited to finding one parent in the case of a building. in the future, we may need to find/display all matching parcels.
   */
  useDeepCompareEffect(() => {
    const highlightSelectedProperty = async (latLng: LatLng) => {
      const parcelLayerData = await parcelsService.findOneWhereContains(latLng);
      if (parcelLayerData?.features?.length > 0) {
        activeFeatureLayer?.addData(parcelLayerData.features[0]);
      }
    };
    if (
      !!activeFeatureLayer &&
      !!selectedProperty?.parcelDetail?.latitude &&
      !!selectedProperty?.parcelDetail?.longitude
    ) {
      activeFeatureLayer.clearLayers();
      highlightSelectedProperty({
        lat: selectedProperty.parcelDetail?.latitude as number,
        lng: selectedProperty.parcelDetail?.longitude as number,
      } as LatLng);
      if (!!selectedProperty.parcelDetail?.parcels?.length) {
        selectedProperty.parcelDetail.parcels.forEach((parcel) => {
          if (!!parcel?.longitude && !!parcel.latitude) {
            highlightSelectedProperty({
              lat: parcel?.latitude as number,
              lng: parcel?.longitude as number,
            } as LatLng);
          }
        });
      }
    }
  }, [selectedProperty, activeFeatureLayer]);

  /**
   * If there is a draft property on the map, attempt to retrieve the corresponding parcel. If we find matching parcel data, use that to draw the active parcel.
   * Note: currently this is limited to finding one parent in the case of a building. in the future, we may need to find/display all matching parcels.
   */
  useDeepCompareEffect(() => {
    const highlightSelectedProperty = async () => {
      const draftProperty = draftProperties[0];
      const parcelLayerData = await parcelsService.findOneWhereContains({
        lat: draftProperty.geometry.coordinates[1] || 0,
        lng: draftProperty.geometry.coordinates[0] || 0,
      } as LatLng);
      if (parcelLayerData?.features?.length > 0) {
        activeFeatureLayer?.addData(parcelLayerData.features[0]);
      }
    };
    if (!!activeFeatureLayer && draftProperties.length) {
      activeFeatureLayer.clearLayers();
      highlightSelectedProperty();
    }
  }, [draftProperties, activeFeatureLayer]);

  return { activeFeatureLayer };
};

export default useActiveFeatureLayer;
