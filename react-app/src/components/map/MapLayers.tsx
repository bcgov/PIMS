import React from 'react';
import { TileLayer, WMSTileLayer } from 'react-leaflet';

const MapLayers = () => {
  const PARCEL_LAYER_URL =
    'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows';

  return (
    <>
      {/* Tile Layer for Street Maps */}
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Parcel Layer for Parcel Boundaries */}
      <WMSTileLayer
        url={PARCEL_LAYER_URL}
        format="image/png; mode=8bit"
        transparent={true}
        opacity={0.5}
        layers="WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW"
      />
    </>
  );
};

export default MapLayers;
