import { ClusterGeo } from '@/components/map/InventoryLayer';
import PropertyRow from '@/components/map/propertyRow/PropertyRow';
import { PropertyTypes } from '@/constants/propertyTypes';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { formatNumber, pidFormatter } from '@/utilities/formatters';
import { ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Point } from 'leaflet';
import React, { useEffect } from 'react';

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

const ClusterPopup = (props: ClusterPopupProps) => {
  const { popupState, setPopupState } = props;
  const api = usePimsApi();
  const { data: agencyData, loadOnce: loadAgencies } = useDataLoader(api.agencies.getAgencies);
  const { data: adminAreaData, loadOnce: loadAdminAreas } = useDataLoader(
    api.administrativeAreas.getAdministrativeAreas,
  );
  loadAgencies();
  loadAdminAreas();

  /**
   * The following block of code determines which direction and position the popup should open with.
   * Depending on the screen size, it determines the quadrant of the mouse event and choses a position and offset.
   */
  const screenCentre = { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 }; // -100 to account for the side menu being open
  let offset: { x: number; y: number } = { x: 0, y: 0 };
  // Depending on how many properties are available, y displacement changes. 1 = 0, 2 = -90, else -210
  const bottomYOffset =
    popupState.properties.length < 3 ? (popupState.properties.length === 2 ? -90 : 0) : -210;
  // Determine quadrant and set offset
  const leftXOffset = 25;
  const rightXOffset = -405;
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
      overflow={'scroll'}
      borderRadius={'10px'}
    >
      <Grid container height={50} sx={{ backgroundColor: 'rgb(221,221,221)' }}>
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
          content1={
            adminAreaData?.find((aa) => aa.Id === property.properties.AdministrativeAreaId)?.Name ??
            'No Administrative Area'
          }
          content2={
            agencyData?.find((a) => a.Id === property.properties.AgencyId)?.Name ?? 'No Agency'
          }
        />
      ))}
    </Box>
  );
};

export default ClusterPopup;
