import { IPropertyDetail } from 'actions/parcelsActions';
import { LayerPopupInformation } from '../leaflet/Map';
import { geoJSON, Map as LeafletMap, GeoJSON, LatLng } from 'leaflet';
import { useState } from 'react';
import { MapProps as LeafletMapProps, Map as ReactLeafletMap } from 'react-leaflet';
import { useLayerQuery, PARCELS_LAYER_URL, parcelLayerPopupConfig } from '../leaflet/LayerPopup';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { GeoJsonObject } from 'geojson';

interface IUseActiveParcelMapLayer {
  /** the current leaflet map reference. This hook will add layers to this map reference. */
  mapRef: React.RefObject<ReactLeafletMap<LeafletMapProps, LeafletMap>>;
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
  const parcelsService = useLayerQuery(PARCELS_LAYER_URL);

  if (!!mapRef.current && !activeFeatureLayer) {
    setActiveFeatureLayer(geoJSON().addTo(mapRef.current.leafletElement));
  }
  /**
   * if the layerPopup is currently being displayed, set the active feature to be the data displayed by the layerPopup.
   */
  useDeepCompareEffect(() => {
    if (!!activeFeatureLayer) {
      activeFeatureLayer.clearLayers();
      layerPopup?.feature && activeFeatureLayer.addData(layerPopup.feature);
    }
  }, [layerPopup]);

  /**
   * Other areas of the application may kick off parcel layer requests, if so, display the last request tracked in redux.
   */
  useDeepCompareEffect(() => {
    if (!!activeFeatureLayer && !!parcelLayerFeature) {
      activeFeatureLayer.clearLayers();
      activeFeatureLayer.addData(parcelLayerFeature);
      let coords = (parcelLayerFeature as any)?.geometry?.coordinates;
      if (coords && coords.length === 1 && coords[0].length > 1 && coords[0][0].length > 1) {
        const latLng = {
          lat: (parcelLayerFeature as any)?.geometry?.coordinates[0][0][1],
          lng: (parcelLayerFeature as any)?.geometry?.coordinates[0][0][0],
        };
        const center = geoJSON((parcelLayerFeature as any).geometry)
          .getBounds()
          .getCenter();

        mapRef.current?.leafletElement.panTo(latLng);
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
  }, [parcelLayerFeature]);

  /**
   * If there is a selected property on the map, attempt to retrieve the corresponding parcel. If we find matching parcel data, use that to draw the active parcel.
   * Note: currently this is limited to finding one parent in the case of a building. in the future, we may need to find/display all matching parcels.
   */
  useDeepCompareEffect(() => {
    const highlightSelectedProperty = async () => {
      const parcelLayerData = await parcelsService.findOneWhereContains({
        lat: selectedProperty?.parcelDetail?.latitude || 0,
        lng: selectedProperty?.parcelDetail?.longitude || 0,
      } as LatLng);
      if (parcelLayerData?.features?.length > 0) {
        activeFeatureLayer?.addData(parcelLayerData.features[0]);
      }
    };
    if (!!activeFeatureLayer) {
      activeFeatureLayer.clearLayers();
      highlightSelectedProperty();
    }
  }, [selectedProperty]);

  return { activeFeatureLayer };
};

export default useActiveFeatureLayer;
