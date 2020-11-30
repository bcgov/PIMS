import { GEO_PROPERTIES, IGeoSearchParams } from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import { BBox, Feature } from 'geojson';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { LatLngBounds } from 'leaflet';
import React from 'react';
import { useLeaflet } from 'react-leaflet';
import { PointFeature } from '../types';
import PointClusterer from './PointClusterer';

export type InventoryLayerProps = {
  /** Latitude and Longitude boundary of the layer. */
  bounds?: LatLngBounds;
  /** Zoom level of the map. */
  zoom: number;
  /** Minimum zoom level allowed. */
  minZoom?: number;
  /** Maximum zoom level allowed. */
  maxZoom?: number;
  /** Search filter to apply to properties. */
  filter?: IGeoSearchParams;
  /** What to do when the point feature is clicked. */
  onMarkerClick?: (point: PointFeature, position?: [number, number]) => void;
};

/**
 * Get a new instance of a BBox from the specified 'bounds'.
 * @param bounds The latitude longitude boundary.
 */
const getBbox = (bounds: LatLngBounds): BBox => {
  return [
    bounds.getSouthWest().lng,
    bounds.getSouthWest().lat,
    bounds.getNorthEast().lng,
    bounds.getNorthEast().lat,
  ] as BBox;
};

/**
 * Displays the search results onto a layer with clustering.
 * This component makes a request to the PIMS API properties search WFS endpoint.
 */
export const InventoryLayer: React.FC<InventoryLayerProps> = ({
  bounds = null,
  zoom,
  minZoom,
  maxZoom,
  filter,
  onMarkerClick,
}) => {
  const keycloak = useKeycloakWrapper();
  const [features, setFeatures] = React.useState<Array<PointFeature>>([]);
  const { map } = useLeaflet();

  if (!map) {
    throw new Error('<InventoryLayer /> must be used under a <Map> leaflet component');
  }

  const [bbox, setBbox] = React.useState<BBox>(getBbox(bounds ?? map.getBounds()));

  // Recreate the boundary box for the maps current position.
  React.useEffect(() => {
    const rebound = () => {
      const bounds = map.getBounds();
      setBbox(getBbox(bounds));
    };
    map.on('moveend', rebound);
  }, [map]);

  minZoom = minZoom ?? 0;
  maxZoom = maxZoom ?? 18;

  const url = `${ENVIRONMENT.apiUrl}${GEO_PROPERTIES({
    bbox: (bounds ?? map.getBounds()).toBBoxString(),
    address: filter?.address,
    administrativeArea: filter?.administrativeArea,
    pid: filter?.pid,
    projectNumber: filter?.projectNumber,
    agencies: filter?.agencies,
    classificationId: filter?.classificationId,
    minLandArea: filter?.minLandArea,
    maxLandArea: filter?.maxLandArea,
    inSurplusPropertyProgram: filter?.inSurplusPropertyProgram,
    inEnhancedReferralProcess: filter?.inEnhancedReferralProcess,
  } as IGeoSearchParams)}`;

  // Fetch the geoJSON collection of properties.
  useDeepCompareEffect(() => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${keycloak.obj.token}`,
      },
    })
      .then(async response => {
        const data = (await response.json()) as Feature[];
        const points = data.map(f => {
          return {
            ...f,
          } as PointFeature;
        });
        setFeatures(points);
      })
      .catch(error => {
        console.log(error);
      });
  }, [url, bbox]);

  return (
    <PointClusterer
      points={features}
      zoom={zoom}
      bounds={bbox}
      onMarkerClick={onMarkerClick}
      zoomToBoundsOnClick={true}
      spiderfyOnMaxZoom={true}
    />
  );
};
