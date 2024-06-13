import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { formatNumber, pidFormatter } from '@/utilities/formatters';
import { FilterList, ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import { Box, Paper, Grid, IconButton, Typography, Icon, useTheme } from '@mui/material';
import sideBarIcon from '@/assets/icons/SidebarLeft-Linear.svg';
import { Map } from 'leaflet';
import React, { CSSProperties, Dispatch, SetStateAction, useLayoutEffect, useState } from 'react';
import PropertyRow from '@/components/map/propertyRow/PropertyRow';
import { PropertyTypes } from '@/constants/propertyTypes';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import FilterControl from '@/components/map/controls/FilterControl';

interface MapSidebarProps {
  properties: PropertyGeo[];
  map: React.MutableRefObject<Map>;
  setFilter: Dispatch<SetStateAction<object>>;
}

/**
 * Used alongside the Map to display a list of visible properties.
 *
 * @param {MapSidebarProps} props - The props object used for MapSidebar component.
 * @returns {JSX.Element} The MapSidebar component.
 */
const MapSidebar = (props: MapSidebarProps) => {
  const { properties, map, setFilter } = props;
  const [propertiesInBounds, setPropertiesInBounds] = useState<PropertyGeo[]>(properties ?? []);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const theme = useTheme();
  const api = usePimsApi();
  const propertyPageSize = 20; // Affects paging size
  const sidebarWidth = 350;

  // Get related data for lookups
  const { data: agencyData, loadOnce: loadAgencies } = useDataLoader(api.agencies.getAgencies);
  const { data: adminAreaData, loadOnce: loadAdminAreas } = useDataLoader(
    api.administrativeAreas.getAdministrativeAreas,
  );
  loadAgencies();
  loadAdminAreas();

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
      return () => {
        map.current.removeEventListener('zoomend', definePropertiesInBounds);
        map.current.removeEventListener('moveend', definePropertiesInBounds);
      };
    }
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
          <Grid item xs={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <IconButton onClick={() => setFilterOpen(!filterOpen)}>
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
            <IconButton onClick={() => setSidebarOpen(false)}>
              <Icon sx={{ mb: '2px' }}>
                <img height={18} width={18} src={sideBarIcon} />
              </Icon>
            </IconButton>
          </Grid>
        </Grid>

        {/* List of Properties */}
        <Box overflow={'scroll'} height={'100%'} display={'flex'} flexDirection={'column'}>
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
                    : pidFormatter(property.properties.PID) ?? String(property.properties.PIN)
                }
                content1={
                  adminAreaData?.find((aa) => aa.Id === property.properties.AdministrativeAreaId)
                    ?.Name ?? 'No Administrative Area'
                }
                content2={
                  agencyData?.find((a) => a.Id === property.properties.AgencyId)?.Name ??
                  'No Agency'
                }
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
        <div
          style={{
            margin: 'auto',
            transform: `rotate(${!sidebarOpen ? '3.142rad' : '0'})`,
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
        <FilterControl setFilter={setFilter} />
      </Box>
    </>
  );
};

export default MapSidebar;
