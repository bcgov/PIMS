import './LeafletDraw.scss';

import { Feature, FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import * as React from 'react';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
require('leaflet-draw');

interface ILeafletDrawProps {
  /**
   * Current value of the editable feature group
   */
  value: FeatureCollection;
  /**
   * Triggered when layers in the editable featureGroup have been edited and saved
   */
  onChange: (featureCollection: FeatureCollection) => void;
  /**
   * Triggered when a new feature (Polygon) has been created.
   */
  onCreate: (feature: Feature) => void;
  /**
   * Triggered when layers have been removed (and saved) from the editable featureGroup.
   */
  onDelete?: (featureCollection: FeatureCollection) => void;
  /**
   * Disable/hide the polygon draw toolbar
   */
  readonly?: boolean;
  /**
   * Only disable adding new polygons to the editable feature group
   */
  canAdd?: boolean;
  /**
   * Color of the polygon boundaries
   */
  color?: string;
}

const featureGroup = new L.FeatureGroup();

/**
 * A component to draw polygons on a map
 * @example ./LeafletDraw.md
 */
export const LeafletDraw: React.FC<ILeafletDrawProps> = ({
  onChange,
  onCreate,
  value,
  onDelete,
  readonly,
  canAdd,
  color = '#fcba19',
}) => {
  const mapInstance = useMap();

  useEffect(() => {
    if (!!mapInstance) {
      const drawControl = new (L.Control as any).Draw({
        position: 'topright',
        draw: !readonly && {
          rectangle: canAdd,
          polygon: canAdd,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
        },
        edit: {
          featureGroup,
          edit: !readonly,
          remove: !readonly,
        },
      });
      mapInstance.addControl(drawControl);
    }
  }, [mapInstance, readonly, canAdd]);

  useEffect(() => {
    if (!!mapInstance) {
      L.geoJSON(value, {
        style: {
          color,
          weight: 3,
          opacity: 1,
        },
        filter: (feature) => feature.properties.editable,
      }).eachLayer((layer) => {
        featureGroup.addLayer(layer);
      });

      mapInstance.addLayer(featureGroup);

      mapInstance.on((L as any).Draw.Event.CREATED, (e: any) => {
        e.layer.options = {
          ...e.layer.options,
          color,
          weight: 3,
          opacity: 1,
        };
        featureGroup.addLayer(e.layer);
        onCreate(e.layer.toGeoJSON());
      });

      mapInstance.on('draw:edited', (e: any) => {
        const layers = e.layers;
        onChange(layers.toGeoJSON());
      });

      mapInstance.on('draw:deleted', (e: any) => {
        const layers = e.layers;
        onDelete && onDelete(layers.toGeoJSON());
      });

      return () => {
        mapInstance.removeEventListener((L as any).Draw.Event.CREATED);
        mapInstance.removeEventListener('draw:edited');
        mapInstance.removeEventListener('draw:deleted');
        featureGroup.clearLayers();
      };
    }
  }, [mapInstance, value, color, onDelete, onChange, onCreate]);

  return null;
};

export default LeafletDraw;
