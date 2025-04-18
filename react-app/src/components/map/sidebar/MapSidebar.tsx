import { MapFilter, PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { formatNumber, pidFormatter } from '@/utilities/formatters';
import { FilterList, ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import {
  Box,
  Paper,
  Grid,
  IconButton,
  Typography,
  Icon,
  useTheme,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import sideBarIcon from '@/assets/icons/SidebarLeft-Linear.svg';
import sideBarClosedIcon from '@/assets/icons/SidebarLeft-Linear-White.svg';
import { Map } from 'leaflet';
import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import PropertyRow from '@/components/map/propertyRow/PropertyRow';
import { PropertyTypes } from '@/constants/propertyTypes';
import FilterControl from '@/components/map/controls/FilterControl';
import { LookupContext } from '@/contexts/lookupContext';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadExcelFile } from '@/utilities/downloadExcelFile';
import usePimsApi from '@/hooks/usePimsApi';
import { SnackBarContext } from '@/contexts/snackbarContext';
import { getPropertyExportMap } from '@/utilities/getPropertyExportMap';

interface MapSidebarProps {
  properties: PropertyGeo[];
  map: React.MutableRefObject<Map>;
  filter: MapFilter;
  setFilter: Dispatch<SetStateAction<MapFilter>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Used alongside the Map to display a list of visible properties.
 *
 * @param {MapSidebarProps} props - The props object used for MapSidebar component.
 * @returns {JSX.Element} The MapSidebar component.
 */
const MapSidebar = (props: MapSidebarProps) => {
  const { properties, map, setFilter, sidebarOpen, setSidebarOpen, filter } = props;
  const [propertiesInBounds, setPropertiesInBounds] = useState<PropertyGeo[]>(properties ?? []);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const theme = useTheme();
  const propertyPageSize = 20; // Affects paging size
  const sidebarWidth = 350;
  const snackbar = useContext(SnackBarContext);

  // Tools to prepare properties for export.
  const api = usePimsApi();
  const excelDataMap = getPropertyExportMap();

  // Get related data for lookups
  const { getLookupValueById } = useContext(LookupContext);

  // Sets the properties that are in the map's bounds at current view. Resets the page index.
  const definePropertiesInBounds = () => {
    if (properties && properties.length) {
      const newBounds = map.current.getBounds();
      setPropertiesInBounds(
        properties.filter((property) =>
          newBounds.contains([property.geometry.coordinates[1], property.geometry.coordinates[0]]),
        ),
      );
      setPageIndex(0);
    }
  };

  // Event listeners. Must be this style because we are outside of MapContainer.
  // hook and return used to keep event listeners from stacking
  useLayoutEffect(() => {
    if (map.current) {
      map.current.addEventListener('zoomend', definePropertiesInBounds);
      map.current.addEventListener('moveend', definePropertiesInBounds);
    }

    return () => {
      if (map.current) {
        map.current.removeEventListener('zoomend', definePropertiesInBounds);
        map.current.removeEventListener('moveend', definePropertiesInBounds);
      }
    };
  });

  return (
    <>
      <Box
        id="map-sidebar"
        zIndex={1000}
        position={'fixed'}
        right={sidebarOpen ? 0 : '-400px'}
        height={'calc(100vh - 75px)'}
        component={Paper}
        width={sidebarWidth}
        overflow={'hidden'}
        display={'flex'}
        flexDirection={'column'}
        sx={{
          transition: 'ease-in-out 0.5s',
        }}
      >
        {/* Sidebar Header */}
        <Grid container height={50} sx={{ backgroundColor: 'rgb(221,221,221)' }}>
          <Grid item xs={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <IconButton onClick={() => setFilterOpen(!filterOpen)} id="map-filter-open">
              <FilterList />
            </IconButton>
            <Tooltip title="Export to Excel">
              <IconButton
                onClick={async () => {
                  setIsExporting(true);
                  try {
                    // Get properties and convert to correct structure
                    const rows = await api.properties.propertiesMapExport(filter);
                    const convertedRows = excelDataMap(rows);
                    // download function expects MUI table format
                    const mappedRows = convertedRows.map((r, i) => ({
                      model: r,
                      id: i,
                    }));
                    downloadExcelFile({
                      data: mappedRows,
                      tableName: 'MapProperties',
                      includeDate: true,
                    });
                  } catch {
                    snackbar.setMessageState({
                      style: snackbar.styles.warning,
                      text: 'Table failed to export.',
                      open: true,
                    });
                  }
                  setIsExporting(false);
                }}
              >
                {isExporting ? <CircularProgress size={24} /> : <DownloadIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={7} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <IconButton
              id="sidebar-decrement"
              size="small"
              onClick={() => {
                if (pageIndex > 0) {
                  setPageIndex(pageIndex - 1);
                }
              }}
            >
              <ArrowCircleLeft fontSize="small" />
            </IconButton>
            <Grid item container display={'flex'} justifyContent={'center'} id="sidebar-count">
              <Grid item>
                <Typography
                  margin={'0 0.3em'}
                  fontSize={'0.8em'}
                >{`${pageIndex + 1} of ${formatNumber(Math.max(Math.ceil(propertiesInBounds.length / propertyPageSize), 1))}`}</Typography>
              </Grid>
              <Grid item>
                <Typography
                  margin={'0 0.3em'}
                  fontSize={'0.8em'}
                >{`(${formatNumber(propertiesInBounds.length)} items)`}</Typography>
              </Grid>
            </Grid>
            <IconButton
              id="sidebar-increment"
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
            <IconButton onClick={() => setSidebarOpen(false)} id="sidebar-button-close">
              <Icon sx={{ mb: '2px' }}>
                <img height={18} width={18} src={sideBarIcon} />
              </Icon>
            </IconButton>
          </Grid>
        </Grid>

        {/* List of Properties */}
        <Box height={'100%'} display={'flex'} flexDirection={'column'} sx={{ overflowY: 'scroll' }}>
          {propertiesInBounds
            .slice(pageIndex * propertyPageSize, pageIndex * propertyPageSize + propertyPageSize)
            .map((property) => (
              <PropertyRow
                key={`${property.properties.PropertyTypeId === PropertyTypes.BUILDING ? 'Building' : 'Land'}-${property.properties.Id}`}
                id={property.properties.Id}
                propertyTypeId={property.properties.PropertyTypeId}
                classificationId={property.properties.ClassificationId}
                title={
                  // Buildings get name, unless it's all numbers or empty, then get address
                  // Parcels use PID or PIN
                  property.properties.PropertyTypeId === PropertyTypes.BUILDING
                    ? property.properties.Name.match(/^\d*$/) || property.properties.Name == ''
                      ? property.properties.Address1
                      : property.properties.Name
                    : property.properties.PID != null && property.properties.PID != 0
                      ? pidFormatter(property.properties.PID)
                      : String(property.properties.PIN)
                }
                content={[
                  property.properties.Address1,
                  getLookupValueById(
                    'AdministrativeAreas',
                    property.properties.AdministrativeAreaId,
                  )?.Name ?? 'No Administrative Area',
                  getLookupValueById('Agencies', property.properties.AgencyId)?.Name ?? 'No Agency',
                ]}
                projectStatusId={property.properties.ProjectStatusId}
              />
            ))}
        </Box>
      </Box>
      {/* Sidebar button that is shown when sidebar is closed */}
      <Box
        id="sidebar-button"
        style={
          {
            transition: 'all 1s',
            position: 'fixed',
            top: '80px',
            right: sidebarOpen ? '-70px' : 0,
            width: '50px',
            height: '50px',
            borderTopLeftRadius: '50px',
            borderBottomLeftRadius: '50px',
            backgroundColor: theme.palette.blue.main,
            zIndex: 1000,
            display: 'flex',
            cursor: 'pointer',
          } as unknown as CSSProperties
        }
        onClick={() => setSidebarOpen(true)}
      >
        {/* All this just to get the SVG white */}
        <img
          style={{
            margin: 'auto',
            transform: `rotate(${!sidebarOpen ? '3.142rad' : '0'})`,
            transition: 'ease-in-out 0.5s',
            width: '40%',
            height: '40%',
            borderRadius: '100%',
          }}
          height={18}
          width={18}
          src={sideBarClosedIcon}
        />
      </Box>

      {/* Filter Container */}
      <Box
        id="map-filter-container"
        zIndex={999}
        position={'fixed'}
        right={filterOpen && sidebarOpen ? sidebarWidth : '-400px'}
        height={'calc(100vh - 75px)'}
        component={Paper}
        width={sidebarWidth}
        overflow={'hidden'}
        display={'flex'}
        flexDirection={'column'}
        sx={{
          transition: 'ease-in-out 0.5s',
        }}
      >
        <FilterControl setFilter={setFilter} filter={filter} />
      </Box>
    </>
  );
};

export default MapSidebar;
