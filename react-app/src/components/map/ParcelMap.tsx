import { Box, CircularProgress } from '@mui/material';
import React, { createContext, PropsWithChildren, useState } from 'react';
import { MapContainer, useMapEvents } from 'react-leaflet';
import { Map } from 'leaflet';
import MapLayers from '@/components/map/MapLayers';
import { ParcelPopup } from '@/components/map/parcelPopup/ParcelPopup';
import { InventoryLayer } from '@/components/map/InventoryLayer';
import MapPropertyDetails from '@/components/map/MapPropertyDetails';

type ParcelMapProps = {
  height: string;
  mapRef?: React.Ref<Map>;
  movable?: boolean;
  zoomable?: boolean;
  loadProperties?: boolean;
  popupSize?: 'small' | 'large';
  scrollOnClick?: boolean;
} & PropsWithChildren;

export const SelectedMarkerContext = createContext(null);

/**
 * ParcelMap component renders a map with various layers and functionalities.
 *
 * @param {ParcelMapProps} props - The props object containing the height, mapRef, movable, zoomable, and loadProperties properties.
 * @returns {JSX.Element} The ParcelMap component.
 *
 * @example
 * ```tsx
 * <ParcelMap
 *   height="500px"
 *   mapRef={mapRef}
 *   movable={true}
 *   zoomable={true}
 *   loadProperties={false}
 * >
 *   {children}
 * </ParcelMap>
 * ```
 */
const ParcelMap = (props: ParcelMapProps) => {
  const MapEvents = () => {
    useMapEvents({});
    return null;
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState({
    id: undefined,
    type: undefined,
  });

  const {
    height,
    mapRef,
    movable = true,
    zoomable = true,
    loadProperties = false,
    popupSize,
    scrollOnClick,
  } = props;

  return (
    <SelectedMarkerContext.Provider
      value={{
        selectedMarker,
        setSelectedMarker,
      }}
    >
      <Box height={height}>
        <LoadingCover show={loading} />
        <MapPropertyDetails property={selectedMarker} />
        <MapContainer
          style={{ height: '100%' }}
          ref={mapRef}
          bounds={[
            [54.2516, -129.371],
            [49.129, -117.203],
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
          <ParcelPopup size={popupSize} scrollOnClick={scrollOnClick} />
          <MapEvents />
          {loadProperties ? <InventoryLayer setLoading={setLoading} /> : <></>}
          {props.children}
        </MapContainer>
      </Box>
    </SelectedMarkerContext.Provider>
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

export default ParcelMap;
