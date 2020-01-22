import React, { useRef } from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import { LatLngTuple} from 'leaflet';
import './Map.scss';

type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
  activeUserId: string;
};

const Map: React.FC<MapProps> = props => {
  // props
  const mapCenter: LatLngTuple = [props.lat, props.lng];
  const mapRef = useRef<LeafletMap>(null);

  return (
    <LeafletMap ref={mapRef} center={mapCenter} zoom={props.zoom}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </LeafletMap>
  );
};

export default Map;
