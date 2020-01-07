import { Marker } from 'react-leaflet';
import React from 'react';

// Create your own class, extending from the Marker class.
const AutoMarker = props => {

  const openPopup = marker => {
    if (marker && props.autoPopup) {
        marker.leafletElement.openPopup();
    }
  };

  return (
    <Marker ref={el => openPopup(el)} {...props}/>
  );
};
export default AutoMarker;