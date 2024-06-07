import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { formatNumber, pidFormatter } from '@/utilities/formatters';
import { FilterList, ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import { Box, Paper, Grid, IconButton, Typography, Icon, useTheme } from '@mui/material';
import sideBarIcon from '@/assets/icons/SidebarLeft-Linear.svg';
import { Map } from 'leaflet';
import React, { CSSProperties, useState } from 'react';
import PropertyRow from '@/components/map/propertyRow/PropertyRow';
import { PropertyTypes } from '@/constants/propertyTypes';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';

interface MapSidebarProps {
  properties: PropertyGeo[];
  map: React.MutableRefObject<Map>;
}

/**
 * Used alongside the Map to display a list of visible properties.
 *
 * @param {MapSidebarProps} props - The props object used for MapSidebar component.
 * @returns {JSX.Element} The MapSidebar component.
 */
const MapSidebar = (props: MapSidebarProps) => {
  const { properties, map } = props;
  const [propertiesInBounds, setPropertiesInBounds] = useState<PropertyGeo[]>(properties ?? []);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(true);
  const theme = useTheme();
  const api = usePimsApi();
  const propertyPageSize = 10; // Affects paging size

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
  if (map.current) {
    map.current.addEventListener('zoomend', definePropertiesInBounds);
    map.current.addEventListener('moveend', definePropertiesInBounds);
  }

  return (
    <>
      <Box
        id="map-sidebar"
        zIndex={1000}
        position={'fixed'}
        right={open ? 0 : '-400px'}
        height={'calc(100vh - 75px)'}
        component={Paper}
        width={'350px'}
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
            right: open ? '-70px' : 0,
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

export default MapSidebar;
