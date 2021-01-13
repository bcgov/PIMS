import React, { useMemo, useRef, useState } from 'react';
import { IPropertyDetail } from 'actions/parcelsActions';
import { IGeoSearchParams } from 'constants/API';
import { BBox } from 'geojson';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { LatLngBounds } from 'leaflet';
import { useLeaflet } from 'react-leaflet';
import { toast } from 'react-toastify';
import { PointFeature } from '../types';
import PointClusterer from './PointClusterer';
import { useApi } from 'hooks/useApi';
import { debounce, flatten, uniqBy } from 'lodash';
import { tilesInBbox } from 'tiles-in-bbox';

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
      latlngBounds: new LatLngBounds({ lat: SW_lat, lng: SW_long }, { lat: NE_lat, lng: NE_long }),
    };
  });
};

// default BC map bounds
export const defaultBounds = new LatLngBounds(
  [60.09114547, -119.49609429],
  [48.78370426, -139.35937554],
);

// Hooks to store current view tiles
const useTilesRef = (currentValue: ITile[]) => {
  const ref = useRef<ITile[]>(currentValue);
  ref.current = currentValue;
  return ref;
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
  const { map } = useLeaflet();
  const [tilesStorage, setTilesStorage] = useState<ITile[]>([]);
  const tilesRef = useTilesRef(tilesStorage);
  const [done, setDone] = useState(false);
  const { loadProperties } = useApi();

  if (!map || !bounds.isValid()) {
    throw new Error('<InventoryLayer /> must be used under a <Map> leaflet component');
  }

  React.useEffect(() => {
    const tiles = getTiles(bounds, zoom).filter(tile =>
      defaultBounds.intersects(tile.latlngBounds),
    );
    const newTiles: any[] = tiles.filter(
      x => !tilesRef.current.find((tile: ITile) => tile.key === x.key),
    );
    setTilesStorage(tilesRef.current.concat(newTiles));
  }, [zoom, bounds, tilesRef]);

  React.useEffect(() => {
    if (tilesRef.current.length > 0) {
      setTilesStorage(tilesRef.current.map(x => ({ ...x, processed: false })));
    }
  }, [filter, tilesRef]);

  const features = React.useMemo(() => {
    const data = flatten(
      tilesStorage
        .filter(x => !!x.datum)
        .filter(x => x.point.z === zoom)
        .map(x => x.datum),
    )
      .filter(feature => {
        return !(
          feature?.properties!.propertyTypeId === selected?.propertyTypeId &&
          feature?.properties!.id === selected?.parcelDetail?.id
        );
      })
      .map(f => {
        return {
          ...f,
        } as PointFeature;
      });

    return uniqBy(data, point => `${point.properties.id}-${point.properties.propertyTypeId}`);
  }, [tilesStorage, selected, zoom]);

  const bbox = getBbox(bounds);

  minZoom = minZoom ?? 0;
  maxZoom = maxZoom ?? 18;

  const params = useMemo<IGeoSearchParams[]>((): any => {
    return tilesStorage
      .filter(tile => !tile.processed && tile.point.z === zoom)
      .map(tile => ({
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
        tileKey: tile.key,
      }));
  }, [filter, tilesStorage, zoom]);

  const loadTile = async (filter: IGeoSearchParams) => {
    const tile = tilesRef.current.find(tile => tile.key === filter.tileKey)!;

    if (!map.getBounds().intersects(tile.latlngBounds)) {
      return;
    }

    if (tile?.processed) {
      return tile.datum;
    }

    return loadProperties(filter).then(results => {
      if (tile) {
        setTilesStorage(
          tilesRef.current
            .filter(t => tile.key !== t.key)
            .concat({ ...tile, processed: true, datum: results }),
        );
      }
      return results;
    });
  };

  const search = React.useCallback(
    debounce(
      async (filters: IGeoSearchParams[]) => {
        try {
          await Promise.all(filters.map(x => loadTile(x)));
          setDone(true);
        } catch (error) {
          toast.error((error as Error).message, { autoClose: 7000 });
          console.error(error);
        }
      },
      500,
      { leading: true },
    ),
    [],
  );

  // Fetch the geoJSON collection of properties.
  useDeepCompareEffect(() => {
    setDone(false);
    search(params);
  }, [params, search]);

  return (
    <PointClusterer
      points={features}
      zoom={zoom}
      bounds={bbox}
      onMarkerClick={onMarkerClick}
      zoomToBoundsOnClick={true}
      spiderfyOnMaxZoom={true}
      selected={selected}
      tilesLoaded={done}
    />
  );
};
