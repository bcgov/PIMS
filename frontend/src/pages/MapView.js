import React, {useEffect} from 'react';
import Map from '../components/maps/leaflet/Map';
import './MapView.scss';

export default (props) => {
  useEffect(() => {
    console.log("mapView active user id");
    console.log(props.activeUserId);
  }, [props.activeUserId]);
  return <Map lat={48.43} lng={-123.37} zoom={14} activeUserId={props.activeUserId} />;
};
