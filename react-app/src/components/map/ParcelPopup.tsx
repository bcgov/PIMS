import { GridColumnPair } from '@/components/map/MapPropertyDetails';
import MetresSquared from '@/components/text/MetresSquared';
import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import usePimsApi from '@/hooks/usePimsApi';
import { Box, Grid, List, ListItem, Typography, useTheme } from '@mui/material';
import { LatLng } from 'leaflet';
import React, { useCallback, useEffect, useState } from 'react';
import { Popup, useMap, useMapEvents } from 'react-leaflet';
import './parcelPopup.css';

export const ParcelPopup = () => {
  const [parcelData, setParcelData] = useState<ParcelData[]>(undefined);
  const [clickPosition, setClickPosition] = useState<LatLng>(null);
  const [parcelIndex, setParcelIndex] = useState<number>(0);

  const map = useMap();
  const api = usePimsApi();

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
