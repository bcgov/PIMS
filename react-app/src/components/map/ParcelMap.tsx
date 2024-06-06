import {
  Box,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import React, {
  createContext,
  CSSProperties,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MapContainer, useMapEvents } from 'react-leaflet';
import { LatLngBoundsExpression, Map } from 'leaflet';
import MapLayers from '@/components/map/MapLayers';
import { ParcelPopup } from '@/components/map/parcelPopup/ParcelPopup';
import { InventoryLayer } from '@/components/map/InventoryLayer';
import ControlsGroup from '@/components/map/controls/ControlsGroup';
import FilterControl from '@/components/map/controls/FilterControl';
import useDataLoader from '@/hooks/useDataLoader';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import usePimsApi from '@/hooks/usePimsApi';
import { SnackBarContext } from '@/contexts/snackbarContext';
import sideBarIcon from '@/assets/icons/SidebarLeft-Linear.svg';
import { ArrowCircleLeft, ArrowCircleRight, FilterList } from '@mui/icons-material';
import { formatNumber } from '@/utilities/formatters';

type ParcelMapProps = {
  height: string;
  mapRef?: React.Ref<Map>;
  movable?: boolean;
  zoomable?: boolean;
  loadProperties?: boolean;
  popupSize?: 'small' | 'large';
  scrollOnClick?: boolean;
  zoomOnScroll?: boolean;
  hideControls?: boolean;
} & PropsWithChildren;

export const SelectedMarkerContext = createContext(null);

/**
 * ParcelMap component renders a map with various layers and functionalities.
 *
 * @param {ParcelMapProps} props - The props object containing the height, mapRef, movable, zoomable, and loadProperties properties.
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
    useMapEvents({});
    return null;
  };
  const api = usePimsApi();
  const snackbar = useContext(SnackBarContext);

  const [selectedMarker, setSelectedMarker] = useState({
    id: undefined,
    type: undefined,
  });
  const [filter, setFilter] = useState({}); // Applies when request for properties is made
  const [properties, setProperties] = useState<PropertyGeo[]>([]);

  const { data, refreshData, isLoading } = useDataLoader(() =>
    api.properties.propertiesGeoSearch(filter),
  );

  const {
    height,
    movable = true,
    zoomable = true,
    loadProperties = false,
    popupSize,
    scrollOnClick,
    zoomOnScroll = true,
    hideControls = false,
  } = props;

  const mapRef = useRef<Map>();

  const defaultBounds = [
    [54.2516, -129.371],
    [49.129, -117.203],
  ];

  // Get the property data for mapping
  useEffect(() => {
    if (data) {
      if (data.length) {
        setProperties(data as PropertyGeo[]);
        snackbar.setMessageState({
          open: true,
          text: `${data.length} properties found.`,
          style: snackbar.styles.success,
        });
      } else {
        snackbar.setMessageState({
          open: true,
          text: `No properties found matching filter criteria.`,
          style: snackbar.styles.warning,
        });
        setProperties([]);
      }
    } else {
      refreshData();
    }
  }, [data, isLoading]);

  // Refresh the data if the filter changes
  useEffect(() => {
    refreshData();
  }, [filter]);

  interface MapSidebarProps {
    properties: PropertyGeo[];
    map: React.MutableRefObject<Map>;
  }

  const MapSidebar = (props: MapSidebarProps) => {
    const { properties, map } = props;
    const [propertiesInBounds, setPropertiesInBounds] = useState<PropertyGeo[]>(properties ?? []);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(true);
    const theme = useTheme();
    const propertyPageSize = 10;

    const definePropertiesInBounds = () => {
      if (properties && properties.length) {
        const newBounds = map.current.getBounds();
        setPropertiesInBounds(
          properties.filter((property) =>
            newBounds.contains([
              property.geometry.coordinates[1],
              property.geometry.coordinates[0],
            ]),
          ),
        );
        setPageIndex(0);
      }
    };

    if (map.current) {
      map.current.addEventListener('zoomend', definePropertiesInBounds);
      map.current.addEventListener('moveend', definePropertiesInBounds);
    }
    console.log(propertiesInBounds);
    return (
      <>
        <Box
          id="map-sidebar"
          zIndex={1000}
          position={'fixed'}
          right={open ? 0 : '-400px'}
          height={'100%'}
          component={Paper}
          width={'350px'}
          sx={{
            transition: 'ease-in-out 0.5s',
          }}
        >
          <Grid container height={50} sx={{ backgroundColor: 'rgb(221,221,221)' }}>
            <Grid item xs={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <IconButton>
                <FilterList />
              </IconButton>
            </Grid>
            <Grid item xs={8} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <IconButton
                size="small"
                onClick={() => {
                  if (pageIndex > 0) {
                    setPageIndex(pageIndex - 1);
                  }
                }}
              >
                <ArrowCircleLeft fontSize="small" />
              </IconButton>
              <Typography
                margin={'0 0.5em'}
                fontSize={'0.8em'}
              >{`${pageIndex + 1} of ${formatNumber(Math.ceil(propertiesInBounds.length / propertyPageSize))} (${formatNumber(propertiesInBounds.length)} items)`}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  if (pageIndex + 1 < Math.ceil(propertiesInBounds.length / propertyPageSize)) {
                    setPageIndex(pageIndex + 1);
                  }
                }}
              >
                <ArrowCircleRight fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <IconButton onClick={() => setOpen(false)}>
                <Icon sx={{ mb: '2px' }}>
                  <img height={18} width={18} src={sideBarIcon} />
                </Icon>
              </IconButton>
            </Grid>
          </Grid>
          {propertiesInBounds
            .slice(pageIndex * propertyPageSize, pageIndex * propertyPageSize + propertyPageSize)
            .map((property) => (
              <Box
                key={`${property.properties.PropertyTypeId ? 'Building' : 'Land'}-${property.properties.Id}`}
              >
                {property.properties.Id}
              </Box>
            ))}
        </Box>
        {/* Sidebar button that is shown when sidebar is closed */}
        <Box
          id="sidebar-button"
          style={
            {
              transition: 'all 1s',
              position: 'absolute',
              top: '100px',
              right: open ? '-70px' : 0,
              width: '70px',
              height: '70px',
              borderTopLeftRadius: '50px',
              borderBottomLeftRadius: '50px',
              backgroundColor: theme.palette.blue.main,
              zIndex: 1000,
              display: 'flex',
              cursor: 'pointer',
            } as unknown as CSSProperties
          }
          onClick={() => setOpen(true)}
        >
          {/* All this just to get the SVG white */}
          <div
            style={{
              margin: 'auto',
              transform: `rotate(${!open ? '3.142rad' : '0'})`,
              transition: 'ease-in-out 0.5s',
              maskImage: `url(${sideBarIcon})`,
              WebkitMaskImage: `url(${sideBarIcon})`,
              maskSize: '100%',
              WebkitMaskSize: 'cover',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              width: '40%',
              height: '40%',
              backgroundColor: 'white',
              borderRadius: '100%',
            }}
          ></div>
        </Box>
      </>
    );
  };

  return (
    <SelectedMarkerContext.Provider
      value={{
        selectedMarker,
        setSelectedMarker,
      }}
    >
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
          ref={mapRef}
          bounds={defaultBounds as LatLngBoundsExpression}
          dragging={movable}
          zoomControl={zoomable}
          scrollWheelZoom={zoomOnScroll}
          touchZoom={zoomable}
          boxZoom={zoomable}
          doubleClickZoom={zoomable}
          preferCanvas
        >
          <MapLayers />
          <ParcelPopup size={popupSize} scrollOnClick={scrollOnClick} />
          <MapEvents />
          {loadProperties ? (
            <InventoryLayer isLoading={isLoading} properties={properties} />
          ) : (
            <></>
          )}
          {props.children}
        </MapContainer>
        {loadProperties ? <MapSidebar properties={properties} map={mapRef} /> : <></>}
      </Box>
    </SelectedMarkerContext.Provider>
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
