import { Box, CircularProgress } from '@mui/material';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MapContainer, Polygon, useMapEvents } from 'react-leaflet';
import { LatLngBoundsExpression, LatLngExpression, Map, Point } from 'leaflet';
import MapLayers from '@/components/map/MapLayers';
import { ParcelPopup } from '@/components/map/parcelPopup/ParcelPopup';
import { InventoryLayer } from '@/components/map/InventoryLayer';
import ControlsGroup from '@/components/map/controls/ControlsGroup';
import FilterControl from '@/components/map/controls/FilterControl';
import useDataLoader from '@/hooks/useDataLoader';
import { MapFilter, PropertyGeo } from '@/hooks/api/usePropertiesApi';
import usePimsApi from '@/hooks/usePimsApi';
import { SnackBarContext } from '@/contexts/snackbarContext';
import MapSidebar from '@/components/map/sidebar/MapSidebar';
import ClusterPopup, { PopupState } from '@/components/map/clusterPopup/ClusterPopup';
import { ParcelLayerFeature } from '@/hooks/api/useParcelLayerApi';
import PolygonQuery, { LeafletMultiPolygon } from '@/components/map/polygonQuery/PolygonQuery';

type ParcelMapProps = {
  height: string;
  mapRef?: React.MutableRefObject<Map>;
  movable?: boolean;
  zoomable?: boolean;
  loadProperties?: boolean;
  popupSize?: 'small' | 'large';
  scrollOnClick?: boolean;
  zoomOnScroll?: boolean;
  hideControls?: boolean;
  defaultZoom?: number;
  defaultLocation?: LatLngExpression;
} & PropsWithChildren;

export const SelectedMarkerContext = createContext(null);

/**
 * ParcelMap component renders a map with various layers and functionalities.
 *
 * @param {ParcelMapProps} props - The props object used for ParcelMap component.
 * @returns {JSX.Element} The ParcelMap component.
 *
 * @example
 * ```tsx
 * <ParcelMap
 *   height="500px"
 *   mapRef={mapRef}
 *   movable={true}
 *   zoomable={true}
 *   loadProperties={false}
 * >
 *   {children}
 * </ParcelMap>
 * ```
 */
const ParcelMap = (props: ParcelMapProps) => {
  const MapEvents = () => {
    useMapEvents({
      resize: () => {
        setPopupState({ ...popupState, open: false });
      },
      baselayerchange: (e) => {
        setTileLayerName(e.name);
      },
    });
    return null;
  };
  const api = usePimsApi();
  const snackbar = useContext(SnackBarContext);
  const [filter, setFilter] = useState<MapFilter>({}); // Applies when request for properties is made
  const [properties, setProperties] = useState<PropertyGeo[]>([]);
  const [tileLayerName, setTileLayerName] = useState<string>('Street Map');
  const [polygonQueryShape, setPolygonQueryShape] = useState<LeafletMultiPolygon>({
    type: 'MultiPolygon',
    coordinates: [],
    leafletIds: [],
  });
  const [mapEventsDisabled, setMapEventsDisabled] = useState<boolean>(false);

  // When drawn multipolygon changes, query the new area
  useEffect(() => {
    console.log(polygonQueryShape);
    const polygonCoordinates = polygonQueryShape.coordinates.map((polygon) =>
      polygon.map((point) => [point.lat, point.lng]),
    );
    setFilter({
      ...filter,
      Polygon: polygonCoordinates.length ? JSON.stringify(polygonCoordinates) : undefined,
    });
  }, [polygonQueryShape, setFilter]);

  // Get properties for map.
  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.properties.propertiesGeoSearch(filter),
  );

  // Controls ClusterPopup contents
  const [popupState, setPopupState] = useState<PopupState>({
    open: false,
    properties: [],
    position: new Point(500, 500),
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const controlledSetPopupState = (stateUpdates: Partial<PopupState>) => {
    // Only block if trying to open. Allow users to close popup/change page at all times.
    if (stateUpdates.open && mapEventsDisabled) return;
    setPopupState({
      ...popupState,
      ...stateUpdates,
    });
  };

  // Store polygon overlay data for parcel layer
  const [polygon, setPolygon] = useState([]);

  // Elevated state for the sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const {
    height,
    mapRef,
    movable = true,
    zoomable = true,
    loadProperties = false,
    popupSize,
    scrollOnClick,
    zoomOnScroll = true,
    hideControls = false,
    defaultLocation,
    defaultZoom,
  } = props;

  // To access map outside of MapContainer
  const localMapRef = mapRef ?? useRef<Map>();

  const deletionBroadcastChannel = useMemo(() => new BroadcastChannel('property'), []);
  useEffect(
    () =>
      deletionBroadcastChannel.addEventListener('message', (event) => {
        if (typeof event.data === 'string' && event.data === 'refresh') {
          refreshData();
        }
      }),
    [],
  );

  // Default for BC view
  const defaultBounds = [
    [54.2516, -129.371],
    [49.129, -117.203],
  ];

  // Get the property data for mapping
  useEffect(() => {
    if (data) {
      handleDataChange();
    } else {
      if (loadProperties) {
        refreshData();
      }
    }
  }, [data, isLoading]);

  // Loops through any array and pairs it down to a flat list of its base elements
  // Used here for breaking shape geography down to bounds coordinates
  const extractLowestElements: (arr: any[]) => [number, number][] = (arr) => {
    return arr.reduce((acc, item) => {
      if (Array.isArray(item[0])) {
        return acc.concat(extractLowestElements(item));
      } else {
        acc.push(item);
        return acc;
      }
    }, []);
  };

  const handleDataChange = async () => {
    setPolygon([]);
    if (data.length) {
      setProperties(data as PropertyGeo[]);
      snackbar.setMessageState({
        open: true,
        text: `${data.length} properties found.`,
        style: snackbar.styles.success,
      });
    } else {
      setProperties([]);
      // No properties in inventory. Check the parcel layer.
      const parcelLayerFeatures: ParcelLayerFeature[] = [];
      if (filter.PID) {
        await api.parcelLayer.getParcelByPid(String(filter.PID)).then((response) => {
          parcelLayerFeatures.push(...response.features);
        });
      }
      if (filter.PIN) {
        await api.parcelLayer.getParcelByPin(String(filter.PIN)).then((response) => {
          parcelLayerFeatures.push(...response.features);
        });
      }
      // Were any parcels found that match?
      if (parcelLayerFeatures.length) {
        snackbar.setMessageState({
          open: true,
          text: `No inventory found, but ${parcelLayerFeatures.length} match${parcelLayerFeatures.length > 1 ? 'es' : ''} found on Parcel Layer.`,
          style: snackbar.styles.success,
        });
        // Place feature shapes on map
        if (localMapRef.current) {
          const polygonShapes = [];
          /** Will be one of two types:
           * Polygon for a single shape
           * MultiPolygon for many shapes
           * Coordinates have to be switched to work with Leaflet
           */
          parcelLayerFeatures.forEach((feature) => {
            if (feature.geometry.type === 'Polygon') {
              polygonShapes.push(
                feature.geometry.coordinates
                  .at(0)
                  .map((coordinate) => [coordinate[1], coordinate[0]]),
              );
            } else if (feature.geometry.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((coordinateList) => {
                coordinateList.forEach((list) => {
                  polygonShapes.push(list.map((pair) => [pair[1], pair[0]]));
                });
              });
            }
          });
          setPolygon(polygonShapes);
          // Centres map to encompass all found features. Accepts flat list of coordinate pairs
          localMapRef.current.fitBounds(extractLowestElements(polygonShapes));
          // Hide the sidebar
          setSidebarOpen(false);
        }
      } else {
        // No properties in inventory or in parcel layer
        snackbar.setMessageState({
          open: true,
          text: `No properties or parcels found matching filter criteria.`,
          style: snackbar.styles.warning,
        });
      }
    }
  };

  // Refresh the data if the filter changes
  useEffect(() => {
    if (loadProperties) {
      refreshData();
    }
  }, [filter]);

  return (
    <Box height={height} display={'flex'}>
      {loadProperties ? <LoadingCover show={isLoading} /> : <></>}
      {/* All map controls fit here */}
      {!hideControls && loadProperties ? (
        <ControlsGroup position="topleft">
          <FilterControl setFilter={setFilter} />
        </ControlsGroup>
      ) : (
        <></>
      )}
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        ref={localMapRef}
        bounds={defaultBounds as LatLngBoundsExpression}
        zoom={defaultZoom}
        center={defaultLocation}
        dragging={movable}
        zoomControl={zoomable}
        scrollWheelZoom={zoomOnScroll}
        touchZoom={zoomable}
        boxZoom={zoomable}
        doubleClickZoom={zoomable}
        preferCanvas
      >
        <MapLayers />
        <ParcelPopup
          size={popupSize}
          scrollOnClick={scrollOnClick}
          mapEventsDisabled={mapEventsDisabled}
        />
        <MapEvents />
        <PolygonQuery
          setPolygons={setPolygonQueryShape}
          setMapEventsDisabled={setMapEventsDisabled}
        />
        {loadProperties ? (
          <InventoryLayer
            isLoading={isLoading}
            properties={properties}
            popupState={popupState}
            setPopupState={controlledSetPopupState}
            tileLayerName={tileLayerName}
          />
        ) : (
          <></>
        )}
        {polygon.map((coordinates, index) => (
          <Polygon key={index} pathOptions={{ color: 'blue' }} positions={coordinates} />
        ))}
        {props.children}
      </MapContainer>
      {loadProperties ? (
        <>
          <MapSidebar
            properties={properties}
            map={localMapRef}
            setFilter={setFilter}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <ClusterPopup popupState={popupState} setPopupState={controlledSetPopupState} />
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
export interface LoadingCoverProps {
  show?: boolean;
}

const LoadingCover: React.FC<LoadingCoverProps> = ({ show }) => {
  return show ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: '999',
        left: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </div>
  ) : null;
};

export default ParcelMap;
