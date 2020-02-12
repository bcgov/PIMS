import React, { useRef } from 'react';
import { LatLngBounds } from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.scss';
import { IParcel, IParcelDetail } from 'actions/parcelsActions';
import { ParcelPopupView } from '../ParcelPopupView';

type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
  parcels: IParcel[];
  activeParcel?: IParcelDetail | null;
  onParcelClick?: (obj: IParcel) => void;
  onPopupClose?: (obj: IParcel) => void;
  onViewportChanged?: (bounds: LatLngBounds | null) => void;
};

const Map: React.FC<MapProps> = props => {
  // props
  const { parcels, activeParcel } = props;
  const mapRef = useRef<LeafletMap>(null);

  const getBounds = () => {
    if (!mapRef.current) {
      return null;
    }
    return mapRef.current?.leafletElement.getBounds();
  }
  const handleParcelClick = (parcel: IParcel) => {
    if (props.onParcelClick) {
      props.onParcelClick(parcel);
    }
  };
  const handlePopupClose = (parcel: IParcel) => {
    if (props.onPopupClose) {
      props.onPopupClose(parcel);
    }
  };
  const handleViewportChanged = () => {
    const e = getBounds();
    if (props.onViewportChanged) {
      props.onViewportChanged(e);
    }
  };

  return (
    <LeafletMap
      ref={mapRef}
      center={[props.lat, props.lng]}
      zoom={props.zoom}
      whenReady={() => handleViewportChanged()}
      onViewportChanged={() => handleViewportChanged()}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {parcels && parcels.map(parcel => {
        return (
          <Marker key={parcel.id} position={[parcel.latitude, parcel.longitude]} onClick={() => handleParcelClick(parcel)} />
        );
      })}

      {activeParcel && (
        <Popup position={[activeParcel.latitude, activeParcel.longitude]} offset={[0, -25]} onClose={() => handlePopupClose(activeParcel)}>
          <ParcelPopupView parcelDetail={activeParcel} />
        </Popup>
      )}
    </LeafletMap>
  );
};

export default Map;
