import { Box } from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';
import { MapContainer, useMapEvents, useMap } from 'react-leaflet';
import { Map } from 'leaflet';
import usePimsApi from '@/hooks/usePimsApi';
import MapLayers from '@/components/map/MapLayers';
import { ParcelPopup, PopupData } from '@/components/map/ParcelPopup';

type ParcelMapProps = {
  height: string;
  mapRef?: React.Ref<Map>;
  movable?: boolean;
  zoomable?: boolean;
} & PropsWithChildren;

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
  const { height, mapRef, movable = true, zoomable = true } = props;
  return (
    <Box height={height}>
      <MapContainer
        style={{ height: '100%' }}
        ref={mapRef}
        bounds={[
          [51.2516, -129.371],
          [48.129, -122.203],
        ]}
        dragging={movable}
        zoomControl={zoomable}
        scrollWheelZoom={zoomable}
        touchZoom={zoomable}
        boxZoom={zoomable}
        doubleClickZoom={zoomable}
      >
        <MapLayers />
        {clickPosition?.position && <ParcelPopup clickPosition={clickPosition} />}
        <MapEvents />
        {props.children}
      </MapContainer>
    </Box>
  );
};

export default ParcelMap;
