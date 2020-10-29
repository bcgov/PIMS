import * as React from 'react';
import { GeoJSON } from 'react-leaflet';
import { useLayer } from '../hooks/useLayer';
import { PopupContentConfig, renderPopupContent } from './Popup/LayerPopupContent';
import { BBox } from 'geojson';

interface ILayerProps {
  /**
   * URL to the WFS layer
   */
  src: string;
  opacity?: number;
  weight?: number;
  /**
   * The minimum zoom to start displaying the layer
   */
  minZoom?: number;
  /**
   * Current map bounds
   */
  bbox?: BBox;
  /**
   * Color of the layer path and fill
   */
  color?: string;
  /**
   * A configuration of the feature popup display
   * @example
   * {ADMIN_AREA_SQFT: (data: any) => `${data.ADMIN_AREA_SQFT} ft^2`}
   */
  popupConfig: PopupContentConfig;
}

/**
 * Renders the WFS layer from a URL
 * @param param0
 */
const Layer: React.FC<ILayerProps> = ({ src, bbox, popupConfig, ...rest }) => {
  const bboxString = React.useMemo(
    () => (bbox ? `&bbox=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]},EPSG:4326` : ''),
    [bbox],
  );
  const featureCollection = useLayer(`${src}${bboxString}`, rest.minZoom);

  return (
    <>
      {featureCollection?.features?.map(feature => (
        <GeoJSON
          {...rest}
          key={feature.id}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              layer.bindPopup(
                renderPopupContent({
                  data: feature.properties,
                  config: popupConfig,
                }),
              );
            }
          }}
          data={feature}
        />
      ))}
    </>
  );
};

export default Layer;
