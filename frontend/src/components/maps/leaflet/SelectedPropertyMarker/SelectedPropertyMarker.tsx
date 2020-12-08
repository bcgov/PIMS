import { Map } from 'leaflet';
import * as React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';

/**
 * Wrapper of the React Leaflet marker to auto open the popup for a selected property
 */
const SelectedPropertyMarker: React.FC<MarkerProps & { map: Map }> = props => {
  const ref = React.useRef<any>(undefined);

  React.useEffect(() => {
    if (ref.current.leafletElement) {
      ref.current.leafletElement.openPopup();
    }
  }, []);

  return <Marker {...props} ref={ref} zIndexOffset={9} />;
};

export default SelectedPropertyMarker;
