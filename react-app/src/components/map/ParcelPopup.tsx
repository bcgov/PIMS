import { Typography } from '@mui/material';
import { LatLng } from 'leaflet';
import React from 'react';
import { Popup } from 'react-leaflet';

export interface PopupData {
  position: LatLng | null;
  pin: number | string;
  pid: number | string;
}

export interface ParcelPopupProps {
  clickPosition: PopupData;
}
export const ParcelPopup = (props: ParcelPopupProps) => {
  const { clickPosition } = props;
  return (
    <Popup autoPan={false} position={clickPosition.position}>
      <Typography>{`PID: ${clickPosition?.pid ?? 'None'}`}</Typography>
      <Typography>{`PIN: ${clickPosition?.pin ?? 'None'}`}</Typography>
    </Popup>
  );
};
