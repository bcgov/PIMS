import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { formatNumber } from '@/utilities/formatters';
import { FilterList, ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import { Box, Paper, Grid, IconButton, Typography, Icon, useTheme } from '@mui/material';
import sideBarIcon from '@/assets/icons/SidebarLeft-Linear.svg';
import { Map } from 'leaflet';
import React, { CSSProperties, useState } from 'react';

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
          newBounds.contains([property.geometry.coordinates[1], property.geometry.coordinates[0]]),
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

export default MapSidebar;
