import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { Popup } from 'react-leaflet';

export interface MarkerPopupProps {
  propertyData?: Parcel | Building;
}
export const MarkerPopup = (props: MarkerPopupProps) => {
  const { propertyData } = props;

  return propertyData ? (
    <Popup minWidth={500}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">{`Parcel Info`}</Typography>
        </Grid>
        <Grid item xs={4}>
          PID
        </Grid>
        <Grid item xs={6}>
          {propertyData?.PID}
        </Grid>
        <Grid item xs={4}>
          Name
        </Grid>
        <Grid item xs={6}>
          {propertyData?.Name}
        </Grid>
        <Grid item xs={4}>
          Ministry
        </Grid>
        <Grid item xs={6}>
          {propertyData?.Agency?.Parent?.Name ?? propertyData?.Agency?.Name}
        </Grid>
        <Grid item xs={4}>
          Agency
        </Grid>
        <Grid item xs={6}>
          {propertyData?.Agency?.Name}
        </Grid>
        <Grid item xs={4}>
          Classification
        </Grid>
        <Grid item xs={6}>
          {propertyData?.Classification?.Name}
        </Grid>
      </Grid>
    </Popup>
  ) : (
    <></>
  );
};
