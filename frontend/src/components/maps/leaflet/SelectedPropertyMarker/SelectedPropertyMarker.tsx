import { Map } from 'leaflet';
import * as React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

/**
 * Wrapper of the React Leaflet marker to auto open the popup for a selected property
 */
const SelectedPropertyMarker: React.FC<MarkerProps & { map: Map }> = props => {
  const ref = React.useRef<any>(undefined);

  useDeepCompareEffect(() => {
    if (ref.current.leafletElement) {
      props.map.setView(props.position, props.map.getZoom());
    }
  }, [props.map, props.position]);

  return <Marker {...props} ref={ref} zIndexOffset={9} />;
};

export default SelectedPropertyMarker;
