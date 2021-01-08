import React, { useMemo } from 'react';
import { IPropertyDetail } from 'actions/parcelsActions';
import { IGeoSearchParams } from 'constants/API';
import { BBox, Feature } from 'geojson';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { LatLngBounds } from 'leaflet';
import { useLeaflet } from 'react-leaflet';
import { toast } from 'react-toastify';
import { PointFeature } from '../types';
import PointClusterer from './PointClusterer';
import { useApi } from 'hooks/useApi';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';

export type InventoryLayerProps = {
  /** Latitude and Longitude boundary of the layer. */
  bounds: LatLngBounds;
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

  selected?: IPropertyDetail | null;
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
  bounds,
  zoom,
  minZoom,
  maxZoom,
  filter,
  onMarkerClick,
  selected,
}) => {
  const [features, setFeatures] = React.useState<Array<PointFeature>>([]);
  const { map } = useLeaflet();
  const { loadProperties } = useApi();
  const draftProperties: PointFeature[] = useSelector<RootState, PointFeature[]>(
    state => state.parcel.draftParcels,
  );

  if (!map) {
    throw new Error('<InventoryLayer /> must be used under a <Map> leaflet component');
  }

  const bbox = getBbox(bounds);

  minZoom = minZoom ?? 0;
  maxZoom = maxZoom ?? 18;

  const params = useMemo<IGeoSearchParams>(
    () => ({
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
    }),
    [filter, map, bounds],
  );

  const search = React.useCallback(
    _.debounce(
      (filter: IGeoSearchParams) => {
        loadProperties(filter)
          .then(async (data: Feature[]) => {
            const points = data.map(f => {
              return {
                ...f,
              } as PointFeature;
            });
            setFeatures(points);
          })
          .catch(error => {
            toast.error((error as Error).message, { autoClose: 7000 });
            console.error(error);
          });
      },
      500,
      { leading: true },
    ),
    [],
  );

  // Fetch the geoJSON collection of properties.
  useDeepCompareEffect(() => {
    search(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, bbox, selected, map]);

  return (
    <PointClusterer
      points={features}
      draftPoints={draftProperties}
      zoom={zoom}
      bounds={bbox}
      onMarkerClick={onMarkerClick}
      zoomToBoundsOnClick={true}
      spiderfyOnMaxZoom={true}
      selected={selected}
    />
  );
};
