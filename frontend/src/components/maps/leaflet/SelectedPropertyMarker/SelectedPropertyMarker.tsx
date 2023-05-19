import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { Map } from 'leaflet';
import * as React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';

/**
 * Wrapper of the React Leaflet marker to auto open the popup for a selected property
 */
const SelectedPropertyMarker: React.FC<MarkerProps & { map: Map; className: string }> = (props) => {
  const ref = React.useRef<any>(undefined);
  useDeepCompareEffect(() => {
    if (ref.current.leafletElement) {
      props.map.setView(props.position, props.map.getZoom());
    }
  }, [props.map, props.position]);

  React.useEffect(() => {
    if (props.icon?.options && !!ref.current.leafletElement?.setIcon) {
      props.icon.options.className = props.className;
      ref.current.leafletElement.setIcon(props.icon);
    }
  }, [props.className, props.icon]);

  return <Marker {...props} ref={ref} zIndexOffset={9} />;
};

export default SelectedPropertyMarker;
