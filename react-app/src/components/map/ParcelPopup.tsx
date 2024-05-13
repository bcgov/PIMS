import { GridColumnPair } from '@/components/map/MapPropertyDetails';
import MetresSquared from '@/components/text/MetresSquared';
import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import usePimsApi from '@/hooks/usePimsApi';
import { Box, Grid, List, ListItem, Typography, useTheme } from '@mui/material';
import { LatLng } from 'leaflet';
import React, { useCallback, useEffect, useState } from 'react';
import { Popup, useMap, useMapEvents } from 'react-leaflet';
import './parcelPopup.css';

/**
 * Renders a popup component that displays information about a parcel on the map.
 * The popup is triggered by a click event on the map and shows details such as parcel ID, name, class, plan number, owner type, municipality, regional district, and area.
 * If there are multiple parcels at the clicked location, a select component is displayed to allow the user to choose a specific parcel.
 *
 * @returns {JSX.Element} The ParcelPopup component.
 */
export const ParcelPopup = () => {
  const [parcelData, setParcelData] = useState<ParcelData[]>(undefined); // All parcels at that click location.
  const [clickPosition, setClickPosition] = useState<LatLng>(null);
  const [parcelIndex, setParcelIndex] = useState<number>(0); // If multiple, which parcel to show info for.

  const map = useMap();
  const api = usePimsApi();

  // If click position changes, refresh parcelData
  useEffect(() => {
    getParcelData();
  }, [clickPosition]);

  useMapEvents({
    click: (e) => {
      setClickPosition(e.latlng);
    },
  });

  const getParcelData = useCallback(() => {
    //zoom check here since I don't think it makes sense to allow this at anything more zoomed out than this
    //can't really click on any parcel with much accurancy beyond that point
    if (map.getZoom() > 10) {
      api.parcelLayer.getParcelByLatLng(clickPosition).then((response) => {
        if (response.features.length) {
          setParcelData(
            response.features
              .map((feature) => feature.properties as ParcelData)
              .filter((feature) => feature.PID_FORMATTED || feature.PIN)
              .sort((a, b) => {
                if (a.PID_NUMBER && b.PID_NUMBER) return a.PID_NUMBER - b.PID_NUMBER;
                else return 1;
              }),
          );
          setParcelIndex(0);
          map.setView(clickPosition);
        }
      });
    }
  }, [clickPosition]);

  if (!clickPosition) return <></>;
  return (
    <Popup autoPan={false} position={clickPosition} className="full-size">
      <Box display={'inline-flex'}>
        {parcelData ? (
          <>
            {/* Render a list of PIDs/PINs if there's more than one parcel feature here. */}
            {parcelData.length > 1 ? (
              <ParcelPopupSelect
                parcelData={parcelData}
                onClick={(index: number) => {
                  setParcelIndex(index);
                }}
              />
            ) : (
              <></>
            )}
            <ParcelLayerDetails parcel={parcelData.at(parcelIndex)} />
          </>
        ) : (
          <></>
        )}
      </Box>
    </Popup>
  );
};

interface ParcelLayerDetailsProps {
  parcel: ParcelData;
}

/**
 * Renders the details of a parcel layer.
 *
 * @param {ParcelLayerDetailsProps} props - The props for the component.
 * @param {ParcelData} props.parcel - The parcel data to display.
 * @returns {JSX.Element} The rendered component.
 */
const ParcelLayerDetails = (props: ParcelLayerDetailsProps) => {
  const { parcel } = props;
  return (
    <Box minWidth={'300px'}>
      <Grid container gap={1}>
        <Grid item xs={12}>
          <Typography variant="h4">Parcel Layer</Typography>
        </Grid>
        {parcel.PID_FORMATTED ? (
          <GridColumnPair leftValue={'PID'} rightValue={parcel.PID_FORMATTED} />
        ) : (
          <></>
        )}
        {parcel.PIN != null ? <GridColumnPair leftValue={'PIN'} rightValue={parcel.PIN} /> : <></>}
        <GridColumnPair leftValue={'Name'} rightValue={parcel.PARCEL_NAME} />
        {/* 
        // TODO: Has to come from LTSA
        <GridColumnPair leftValue={'Legal Description'} rightValue={parcel.} /> 
        */}
        <GridColumnPair leftValue={'Class'} rightValue={parcel.PARCEL_CLASS} />
        <GridColumnPair leftValue={'Plan Number'} rightValue={parcel.PLAN_NUMBER} />
        <GridColumnPair leftValue={'Owner Type'} rightValue={parcel.OWNER_TYPE} />
        <GridColumnPair leftValue={'Municipality'} rightValue={parcel.MUNICIPALITY} />
        <GridColumnPair leftValue={'Regional District'} rightValue={parcel.REGIONAL_DISTRICT} />
        <GridColumnPair
          leftValue={'Area'}
          rightValue={
            <>
              <span>{`${parcel.FEATURE_AREA_SQM}`}</span>
              <MetresSquared />
            </>
          }
        />
      </Grid>
    </Box>
  );
};

interface ParcelPopupSelectProps {
  parcelData: ParcelData[];
  onClick?: (index: number) => void;
}

/**
 * Renders a list of parcels for selection in the ParcelPopup component.
 *
 * @param {ParcelPopupSelectProps} props - The props for the ParcelPopupSelect component.
 * @param {ParcelData[]} props.parcelData - The array of parcel data to be displayed.
 * @param {function} props.onClick - The function to be called when a parcel is clicked.
 * @returns {JSX.Element} The rendered ParcelPopupSelect component.
 */
const ParcelPopupSelect = (props: ParcelPopupSelectProps) => {
  const theme = useTheme();
  const { parcelData, onClick } = props;
  return (
    <Box minWidth={'200px'} marginRight={'2em'}>
      <Typography variant="h4">Select Parcel</Typography>
      <Typography variant="caption">(PID/PIN)</Typography>
      <List
        sx={{
          overflowY: 'scroll',
          maxHeight: '300px',
          border: `3px solid ${theme.palette.divider}`,
          borderRadius: '10px',
        }}
      >
        {parcelData.map((parcel, index) => (
          <ListItem
            key={parcel.PARCEL_FABRIC_POLY_ID}
            sx={{
              height: '2em',
              borderTop: `solid 1px ${theme.palette.divider}`,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.divider,
              },
            }}
            onClick={() => {
              onClick(index);
            }}
          >
            <Typography> {parcel.PID_FORMATTED ?? parcel.PIN}</Typography>
          </ListItem>
        ))}
        <ListItem></ListItem>
      </List>
    </Box>
  );
};
