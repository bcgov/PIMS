import { Box, CircularProgress } from '@mui/material';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { MapContainer, useMapEvents, useMap } from 'react-leaflet';
import { Map } from 'leaflet';
import usePimsApi from '@/hooks/usePimsApi';
import MapLayers from '@/components/map/MapLayers';
import { ParcelPopup, PopupData } from '@/components/map/ParcelPopup';
import { InventoryLayer } from '@/components/map/InventoryLayer';
import MapPropertyDetails from '@/components/map/MapPropertyDetails';

export interface ParcelData {
  PARCEL_FABRIC_POLY_ID: number;
  PARCEL_NAME: string;
  PLAN_NUMBER: string;
  PIN: number;
  PID: string;
  PID_FORMATTED: string;
  PID_NUMBER: number;
  PARCEL_STATUS: string;
  PARCEL_CLASS: string;
  OWNER_TYPE: string;
  PARCEL_START_DATE: string;
  MUNICIPALITY: string;
  REGIONAL_DISTRICT: string;
  WHEN_UPDATED: string;
  FEATURE_AREA_SQM: number;
  FEATURE_LENGTH_M: number;
  OBJECTID: number;
  SE_ANNO_CAD_DATA: unknown;
}

type ParcelMapProps = {
  height: string;
  mapRef?: React.Ref<Map>;
  movable?: boolean;
  zoomable?: boolean;
  loadProperties?: boolean;
} & PropsWithChildren;

export const SelectedMarkerContext = createContext(null);

const MapStateWrapper = (props: ParcelMapProps) => {
  const [selectedMarker, setSelectedMarker] = useState({
    id: undefined,
    type: undefined,
  });

  return (
    <SelectedMarkerContext.Provider
      value={{
        selectedMarker,
        setSelectedMarker,
      }}
    >
      <ParcelMap {...props} />
    </SelectedMarkerContext.Provider>
  );
};

export const ParcelMap = (props: ParcelMapProps) => {
  const { selectedMarker } = useContext(SelectedMarkerContext);
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
                pid: response.features[0].properties.PID_FORMATTED,
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
  const [loading, setLoading] = useState<boolean>(false);

  const { height, mapRef, movable = true, zoomable = true, loadProperties = false } = props;
  return (
    <Box height={height}>
      <LoadingCover show={loading} />
      <MapPropertyDetails property={selectedMarker} />
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
        preferCanvas
      >
        <MapLayers />
        {clickPosition?.position && <ParcelPopup clickPosition={clickPosition} />}
        <MapEvents />
        {loadProperties ? <InventoryLayer setLoading={setLoading} /> : <></>}
        {props.children}
      </MapContainer>
    </Box>
  );
};
export interface LoadingCoverProps {
  show?: boolean;
}

const LoadingCover: React.FC<LoadingCoverProps> = ({ show }) => {
  return show ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: '999',
        left: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </div>
  ) : null;
};

export default MapStateWrapper;
