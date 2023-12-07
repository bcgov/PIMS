import { IPropertyDetail } from 'actions/parcelsActions';
import { IGeoSearchParams } from 'constants/API';
import { PropertyTypes } from 'constants/propertyTypes';
import { BBox, Point } from 'geojson';
import { useApiGeocoder } from 'hooks/api';
import { useApi } from 'hooks/useApi';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import L, { GeoJSON, LatLngBounds } from 'leaflet';
import { flatten, uniqBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from 'store';
import { tilesInBbox } from 'tiles-in-bbox';

import { useMapRefreshEvent } from '../hooks/useMapRefreshEvent';
import { useFilterContext } from '../providers/FIlterProvider';
import { PointFeature } from '../types';
import { MUNICIPALITY_LAYER_URL, PARCELS_PUBLIC_LAYER_URL, useLayerQuery } from './LayerPopup';
import PointClusterer from './PointClusterer';

export type InventoryLayerProps = {
  /** Latitude and Longitude boundary of the layer. */
  bounds: LatLngBounds;
  /** Zoom level of the map. */
  zoom: number;
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

let counter = 1000000;

/**
 * Displays the search results onto a layer with clustering.
 * This component makes a request to the PIMS API properties search WFS endpoint.
 */
export const InventoryLayer: React.FC<InventoryLayerProps> = ({
  bounds,
  zoom,
  filter,
  onMarkerClick,
  selected,
  onRequestData,
}) => {
  const keycloak = useKeycloakWrapper();
  const map = useMap();
  const [features, setFeatures] = useState<PointFeature[]>([]);
  const [loadingTiles, setLoadingTiles] = useState(false);
  const { loadProperties } = useApi();
  const { changed: filterChanged } = useFilterContext();
  const municipalitiesService = useLayerQuery(MUNICIPALITY_LAYER_URL);
  const parcelWMSLayerService = useLayerQuery(PARCELS_PUBLIC_LAYER_URL);
  const geocoder = useApiGeocoder();
  // Declare a variable to store the highlighted GeoJSON layer
  const [highlightedParcelLayer, setHighlightedParcelLayer] = useState<L.GeoJSON | null>(null);

  const draftProperties: PointFeature[] = useAppSelector((store) => store.parcel.draftProperties);

  if (!map) {
    throw new Error('<InventoryLayer /> must be used under a <Map> leaflet component');
  }

  const bbox = useMemo(() => {
    const calculatedBbox = getBbox(bounds);
    return calculatedBbox;
  }, [bounds]);

  useEffect(() => {
    const fit = async () => {
      if (filterChanged) {
        map.fitBounds(bounds, { maxZoom: 21 });
      }
    };

    fit();
  }, [map, filter, filterChanged, bounds]);

  const params = useMemo((): any => {
    const tiles = getTiles(defaultBounds, 5);

    return tiles.map((tile) => ({
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
    const inventory = await loadProperties(filter);

    // Make a request to geocoder for properties with the specified address.
    if (!!filter.address) {
      const geo = await geocoder.addresses(filter.address, filter.bbox, filter.administrativeArea);
      const features = geo.data.features
        .filter((f) => f?.properties?.locationDescriptor !== 'provincePoint')
        .map((f) => ({
          ...f,
          properties: {
            id: !!f.properties?.blockID ? f.properties?.blockID : counter++,
            propertyTypeId: PropertyTypes.GEOCODER,
            isSensitive: false,
            statusId: 0,
            name: f.properties?.siteName,
            address: f.properties?.fullAddress,
            administrativeArea: f.properties?.localityName,
            province: 'British Columbia',
            geocoder: f.properties,
            longitude: (f.geometry as Point).coordinates[0],
            latitude: (f.geometry as Point).coordinates[1],
          },
        }));
      return inventory.concat(features);
    }

    return inventory;
  };

  const location = useLocation();
  const search = async (filters: IGeoSearchParams[]) => {
    const queryParams = new URLSearchParams(location.search);
    // check to see if the sidebar is open
    const isSidebarOpen = queryParams.get('sidebar') ?? 'false';

    const pathname = location.pathname;
    // check if we are using the map page
    const isMapView = pathname.includes('mapview');
    try {
      onRequestData(true);
      // Check if there is a highlighted parcel layer, and remove it
      if (highlightedParcelLayer) {
        map.removeLayer(highlightedParcelLayer);
        setHighlightedParcelLayer(null); // Reset the state
      }
      const data = flatten(await Promise.all(filters.map((x) => loadTile(x)))).map((f) => {
        return {
          ...f,
        } as PointFeature;
      });
      const items = uniqBy(
        data,
        (point) => `${point?.properties.id}-${point?.properties.propertyTypeId}`,
      );

      const results: PointFeature[] = items.filter(({ properties }: any) => {
        return (
          properties.propertyTypeId === PropertyTypes.BUILDING ||
          properties.propertyTypeId === PropertyTypes.PARCEL ||
          (properties.propertyTypeId === PropertyTypes.SUBDIVISION &&
            keycloak.canUserEditProperty(properties))
        );
      }) as any;

      const administrativeArea = filter?.administrativeArea;
      const pid = filter?.pid;
      let propertiesFound;
      // If nothing in inventory or parcel layer, zoom to administrative area
      if (results.length > 0 && !!administrativeArea) {
        propertiesFound = results.length;
        setFeatures(results || []);
        const municipality = await municipalitiesService.findByAdministrative(administrativeArea);
        if (municipality) {
          // Fit to municipality bounds
          map.fitBounds((GeoJSON.geometryToLayer(municipality) as any)._bounds, { maxZoom: 11 });
        }
      } else if (results.length > 0 && isMapView && isSidebarOpen === 'false') {
        // If anything is found in inventory
        propertiesFound = results.length;
        setFeatures(results || []);

        // Extract all coordinates from the GeoJSON features
        const allCoordinates: number[][] = results.map((result) => result.geometry.coordinates);

        // Flatten the array of coordinates
        const latLngObjects: L.LatLng[] = ([] as L.LatLng[]).concat(
          ...allCoordinates.map((coord) => L.latLng(coord[1], coord[0])),
        );
        // Create a LatLngBounds object from the LatLng coordinates
        const bounds = L.latLngBounds(latLngObjects);
        map.fitBounds(bounds, {
          maxZoom: 10,
        });
      } else if (
        // if the PID is used in the filter search
        pid !== undefined &&
        !isNaN(parseInt(pid as string)) &&
        parseInt(pid as string) !== 0
      ) {
        const searchedByPID = await parcelWMSLayerService.findByPid(pid ?? '0');
        const pidsFoundInParcelLayer = searchedByPID?.features.length;
        // If nothing in inventory, but found in parcel layer
        propertiesFound = pidsFoundInParcelLayer;
        const firstFeature = searchedByPID.features[0];
        if (firstFeature.geometry) {
          // Create a GeoJSON layer for the highlighted parcel
          const newHighlightedParcelLayer = L.geoJSON(firstFeature.geometry);
          // Add the GeoJSON layer to the map
          newHighlightedParcelLayer.addTo(map);
          // zoom to the highlighted parcel
          map.fitBounds(newHighlightedParcelLayer.getBounds(), { maxZoom: 16 });
          // Update the state with the new highlighted parcel layer
          setHighlightedParcelLayer(newHighlightedParcelLayer);
        } else {
          console.error('Feature does not have geometry property');
        }
      }

      if (propertiesFound && propertiesFound > 0) {
        toast.info(`${propertiesFound} properties found`);
      } else {
        // Nothing found in either inventory or parcel layer
        toast.info('No search results found');
        setFeatures([]);
      }

      setLoadingTiles(false);
    } catch (error) {
      toast.error('Current search contains invalid values.', { autoClose: 7000 });
      console.error(error);
    } finally {
      onRequestData(false);
    }
  };

  useMapRefreshEvent(() => search(params));
  useDeepCompareEffect(() => {
    setLoadingTiles(true);
    search(params);
  }, [params]);

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
