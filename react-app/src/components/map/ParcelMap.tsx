import { Box, Typography } from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';
import { MapContainer, WMSTileLayer, TileLayer, useMapEvents, Popup, useMap } from 'react-leaflet';
import { LatLng, Map } from 'leaflet';
import usePimsApi from '@/hooks/usePimsApi';

const PARCEL_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows';

type ParcelMapProps = {
  height: string;
  mapRef?: React.Ref<Map>;
} & PropsWithChildren;

interface PopupData {
  position: LatLng | null;
  pin: number | string;
  pid: number | string;
}

const ParcelMap = (props: ParcelMapProps) => {
  const api = usePimsApi();
  const MapEvents = () => {
    const map = useMap();
    useMapEvents({
      click: (e) => {
        //zoom check here since I don't think it makes sense to allow this at anything more zoomed out than this
        //can't really click on any parcel with much accurancy beyond that point
        if (map.getZoom() > 10) {
          api.parcelLayer.getParcelByLatLng(e.latlng).then((response) => {
            if (response.features.length) {
              setClickPosition({
                position: e.latlng,
                pid: response.features[0].properties.PID,
                pin: response.features[0].properties.PIN,
              });
            }
          });
        }
      },
    });
    return null;
  };
  const [clickPosition, setClickPosition] = useState<PopupData>(null);
  const { height, mapRef } = props;
  return (
    <Box height={height}>
      <MapContainer
        scrollWheelZoom={'center'}
        style={{ height: '100%' }}
        ref={mapRef}
        bounds={[
          [51.2516, -129.371],
          [48.129, -122.203],
        ]}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <WMSTileLayer
          url={PARCEL_LAYER_URL}
          format="image/png; mode=8bit"
          transparent={true}
          opacity={0.5}
          layers="WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW"
        />
        {clickPosition?.position && (
          <Popup autoPan={false} position={clickPosition.position}>
            <Typography>{`PID: ${clickPosition?.pid ?? 'None'}`}</Typography>
            <Typography>{`PIN: ${clickPosition?.pin ?? 'None'}`}</Typography>
          </Popup>
        )}
        <MapEvents />
        {props.children}
      </MapContainer>
    </Box>
  );
};

export default ParcelMap;
