import React from 'react';
import Map from '../components/maps/leaflet/Map';
import './MapView.scss';

export default (props) => {
  return <Map lat={48.43} lng={-123.37} zoom={14} activeUserId={props.activeUserId} />;
};
