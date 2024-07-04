import { ClusterGeo } from '@/components/map/InventoryLayer';
import PropertyRow from '@/components/map/propertyRow/PropertyRow';
import { PropertyTypes } from '@/constants/propertyTypes';
import { LookupContext } from '@/contexts/lookupContext';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { formatNumber, pidFormatter } from '@/utilities/formatters';
import { ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Point } from 'leaflet';
import React, { useContext, useEffect } from 'react';

export interface PopupState {
  open: boolean;
  properties: (PropertyGeo & ClusterGeo)[];
  position: Point;
  pageSize: number;
  pageIndex: number;
  total: number;
  supercluster?: any;
  clusterId?: number;
}

interface ClusterPopupProps {
  popupState: PopupState;
  setPopupState: React.Dispatch<React.SetStateAction<PopupState>>;
}

/**
 * Renders a popup displaying clustered properties based on the provided popup state.
 * Determines the direction and position of the popup based on the screen size and mouse event quadrant.
 * Allows navigation through clustered properties with pagination controls.
 *
 * @param {ClusterPopupProps} props - The properties to configure the ClusterPopup component.
 * @returns {JSX.Element} A React component representing the ClusterPopup.
 */
const ClusterPopup = (props: ClusterPopupProps) => {
  const { popupState, setPopupState } = props;
  const { getLookupValueById } = useContext(LookupContext);

  /**
   * The following block of code determines which direction and position the popup should open with.
   * Depending on the screen size, it determines the quadrant of the mouse event and choses a position and offset.
   */
  const screenCentre = { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 }; // -100 to account for the side menu being open
  let offset: { x: number; y: number } = { x: 0, y: 0 };
  // Depending on how many properties are available, y displacement changes. 1 = -30, 2 = -120, else -210
  const bottomYOffset =
    popupState.properties.length < 3 ? (popupState.properties.length === 2 ? -180 : -60) : -220;
  // Determine quadrant and set offset
  const leftXOffset = 5;
  const rightXOffset = -415;
  const topYOffset = 80;
  switch (true) {
    // Top-left quadant
    case popupState.position.x <= screenCentre.x && popupState.position.y <= screenCentre.y:
      offset = {
        x: leftXOffset,
        y: topYOffset,
      };
      break;
    // Top-right quadrant
    case popupState.position.x > screenCentre.x && popupState.position.y <= screenCentre.y:
      offset = {
        x: rightXOffset,
        y: topYOffset,
      };
      break;
    // Bottom-left quadrant
    case popupState.position.x <= screenCentre.x && popupState.position.y > screenCentre.y:
      offset = {
        x: leftXOffset,
        y: bottomYOffset,
      };
      break;
    // Bottom-right quadrant
    case popupState.position.x > screenCentre.x && popupState.position.y > screenCentre.y:
      offset = {
        x: rightXOffset,
        y: bottomYOffset,
      };
      break;
  }

  // Handles updating visible properties when the page changes
  useEffect(() => {
    if (popupState.clusterId && popupState.supercluster) {
      const newClusterProperties: (PropertyGeo & ClusterGeo)[] = popupState.supercluster.getLeaves(
        popupState.clusterId, // id of cluster containing properties
        popupState.pageSize, // size of page
        popupState.pageSize * popupState.pageIndex, // offset
      );
      setPopupState({
        ...popupState,
        properties: newClusterProperties,
      });
    }
  }, [popupState.pageIndex]);

  return (
    <Box
      id={'clusterPopup'}
      position={'fixed'}
      width={'400px'}
      height={'fit-content'}
      maxHeight={'300px'}
      left={popupState.position.x + offset.x}
      top={popupState.position.y + offset.y}
      zIndex={900}
      display={popupState.open ? 'flex' : 'none'}
      flexDirection={'column'}
      overflow={'clip'}
      borderRadius={'10px'}
      onMouseLeave={() =>
        setPopupState({
          ...popupState,
          properties: [],
          open: false,
        })
      }
    >
      <Grid container minHeight={40} sx={{ backgroundColor: 'rgb(221,221,221)' }}>
        <Grid item xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <IconButton
            size="small"
            onClick={() => {
              if (popupState.pageIndex > 0) {
                setPopupState({
                  ...popupState,
                  pageIndex: popupState.pageIndex - 1,
                });
              }
            }}
          >
            <ArrowCircleLeft fontSize="small" />
          </IconButton>
          <Typography
            margin={'0 0.5em'}
            fontSize={'0.8em'}
          >{`${popupState.pageIndex + 1} of ${formatNumber(Math.ceil(popupState.total / popupState.pageSize))} (${formatNumber(popupState.total)} items)`}</Typography>
          <IconButton
            size="small"
            onClick={() => {
              if (popupState.pageIndex + 1 < Math.ceil(popupState.total / popupState.pageSize)) {
                setPopupState({
                  ...popupState,
                  pageIndex: popupState.pageIndex + 1,
                });
              }
            }}
          >
            <ArrowCircleRight fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
      <Box overflow={'scroll'}>
        {popupState.properties.map((property) => (
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
            content={[
              property.properties.Address1,
              getLookupValueById('AdministrativeAreas', property.properties.AdministrativeAreaId)
                ?.Name ?? 'No Administrative Area',
              getLookupValueById('Agencies', property.properties.AgencyId)?.Name ?? 'No Agency',
            ]}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ClusterPopup;
