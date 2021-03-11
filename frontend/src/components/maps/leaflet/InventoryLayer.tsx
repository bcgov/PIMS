import React, { useEffect, useMemo, useState } from 'react';
import { IBuilding, IParcel, IPropertyDetail } from 'actions/parcelsActions';
import { IGeoSearchParams } from 'constants/API';
import { BBox } from 'geojson';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { GeoJSON, LatLngBounds } from 'leaflet';
import { useLeaflet } from 'react-leaflet';
import { toast } from 'react-toastify';
import { PointFeature } from '../types';
import PointClusterer from './PointClusterer';
import { useApi } from 'hooks/useApi';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { flatten, uniqBy } from 'lodash';
import { tilesInBbox } from 'tiles-in-bbox';
import { useFilterContext } from '../providers/FIlterProvider';
import { MUNICIPALITY_LAYER_URL, useLayerQuery } from './LayerPopup';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { PropertyTypes } from 'constants/propertyTypes';

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
  /** Callback function to display/hide backdrop*/
  onRequestData: (showBackdrop: boolean) => void;
  /** What to do when the marker is clicked. */
  onMarkerClick: () => void;

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

interface ITilePoint {
  // x axis of the tile
  x: number;
  // y axis of the tile
  y: number;
  // zoom state of the tile
  z: number;
}

interface ITile {
  // Tile point {x, y, z}
  point: ITilePoint;
  // unique id of the file
  key: string;
  // bbox of the tile
  bbox: string;
  // tile data status
  processed?: boolean;
  // tile data, a list of properties in the tile
  datum?: PointFeature[];
  // tile bounds
  latlngBounds: LatLngBounds;
}

/**
 * Generate tiles for current bounds and zoom
 * @param bounds
 * @param zoom
 */
export const getTiles = (bounds: LatLngBounds, zoom: number): ITile[] => {
  const bbox = {
    bottom: bounds.getSouth(),
    left: bounds.getWest(),
    top: bounds.getNorth(),
    right: bounds.getEast(),
  };

  const tiles = tilesInBbox(bbox, zoom);

  // convert tile x axis to longitude
  const tileToLong = (x: number, z: number) => {
    return (x / Math.pow(2, z)) * 360 - 180;
  };

  // convert tile y axis to longitude
  const tileToLat = (y: number, z: number) => {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);

    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  };

  return tiles.map(({ x, y, z }) => {
    const SW_long = tileToLong(x, z);

    const SW_lat = tileToLat(y + 1, z);

    const NE_long = tileToLong(x + 1, z);

    const NE_lat = tileToLat(y, z);

    return {
      key: `${x}:${y}:${z}`,
      bbox: SW_long + ',' + NE_long + ',' + SW_lat + ',' + NE_lat,
      point: { x, y, z },
      datum: [],
      latlngBounds: new LatLngBounds({ lat: SW_lat, lng: SW_long }, { lat: NE_lat, lng: NE_long }),
    };
  });
};

// default BC map bounds
export const defaultBounds = new LatLngBounds(
  [60.09114547, -119.49609429],
  [48.78370426, -139.35937554],
);

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
  onRequestData,
}) => {
  const keycloak = useKeycloakWrapper();
  const { map } = useLeaflet();
  const [features, setFeatures] = useState<PointFeature[]>([]);
  const [loadingTiles, setLoadingTiles] = useState(false);
  const { loadProperties } = useApi();
  const { changed: filterChanged } = useFilterContext();
  const municipalitiesService = useLayerQuery(MUNICIPALITY_LAYER_URL);

  const draftProperties: PointFeature[] = useSelector<RootState, PointFeature[]>(
    state => state.parcel.draftParcels,
  );

  if (!map) {
    throw new Error('<InventoryLayer /> must be used under a <Map> leaflet component');
  }

  const bbox = useMemo(() => getBbox(bounds), [bounds]);
  useEffect(() => {
    const fit = async () => {
      if (filterChanged) {
        map.fitBounds(defaultBounds, { maxZoom: 5 });
      }
    };

    fit();
  }, [map, filter, filterChanged]);

  minZoom = minZoom ?? 0;
  maxZoom = maxZoom ?? 18;

  const params = useMemo((): any => {
    const tiles = getTiles(defaultBounds, 5);

    return tiles.map(tile => ({
      bbox: tile.bbox,
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
      floorCount: filter?.floorCount,
      predominateUseId: Number(filter?.predominateUseId),
      constructionTypeId: filter?.constructionTypeId,
      name: filter?.name,
      bareLandOnly: filter?.bareLandOnly,
      rentableArea: filter?.rentableArea,
      includeAllProperties: filter?.includeAllProperties,
    }));
  }, [filter]);

  const loadTile = async (filter: IGeoSearchParams) => {
    return loadProperties(filter);
  };

  const search = async (filters: IGeoSearchParams[]) => {
    try {
      onRequestData(true);
      const data = flatten(await Promise.all(filters.map(x => loadTile(x)))).map(f => {
        return {
          ...f,
        } as PointFeature;
      });

      const items = uniqBy(
        data,
        point => `${point?.properties.id}-${point?.properties.propertyTypeId}`,
      );

      /**
       * Whether the land has buildings on it.
       * @param property PIMS property
       */
      const hasBuildings = (property: IParcel | IBuilding) => false;

      let results = items.filter(({ properties }: any) => {
        return (
          properties.propertyTypeId === PropertyTypes.BUILDING ||
          !hasBuildings(properties) ||
          (properties.propertyTypeId === PropertyTypes.SUBDIVISION &&
            keycloak.canUserEditProperty(properties))
        );
      }) as any;

      const administrativeArea = filter?.administrativeArea;
      if (results.length === 0 && !!administrativeArea) {
        const municipality = await municipalitiesService.findByAdministrative(administrativeArea);
        if (municipality) {
          // Fit to municipality bounds
          map.fitBounds((GeoJSON.geometryToLayer(municipality) as any)._bounds, { maxZoom: 11 });
        }
      }
      setFeatures(results);
      setLoadingTiles(false);
    } catch (error) {
      toast.error((error as Error).message, { autoClose: 7000 });
      console.error(error);
    } finally {
      onRequestData(false);
    }
  };

  // Fetch the geoJSON collection of properties.
  const parcelDetail = !!selected?.parcelDetail ?? undefined;
  useDeepCompareEffect(() => {
    setLoadingTiles(true);
    search(params);
  }, [params, parcelDetail]);

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
      tilesLoaded={!loadingTiles}
    />
  );
};
