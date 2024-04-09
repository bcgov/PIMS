import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { MapContainer, WMSTileLayer, TileLayer } from 'react-leaflet';
import { Map } from 'leaflet';

const PARCEL_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows';

type ParcelMapProps = {
  height: string;
  mapRef?: React.Ref<Map>;
} & PropsWithChildren;

const ParcelMap = (props: ParcelMapProps) => {
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
        {props.children}
      </MapContainer>
    </Box>
  );
};

export default ParcelMap;
