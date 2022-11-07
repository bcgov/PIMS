import variables from '_variables.module.scss';
import TooltipWrapper from 'components/common/TooltipWrapper';
import ControlPane from 'components/leaflet';
import { LatLngBounds, Map as LeafletMap } from 'leaflet';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { MapContainer as ReactLeafletMap, MapProps as LeafletMapProps } from 'react-leaflet';
import { useAppDispatch } from 'store';
import { setMapViewZoom } from 'store/slices/mapViewZoomSlice';
import styled from 'styled-components';

const ZoomButton = styled(Button)`
  background-color: #ffffff !important;
  color: ${variables.darkVariantColor} !important;
  width: 40px;
  height: 40px;
`;

export type ZoomOutProps = {
  /** The leaflet map */
  map: React.RefObject<ReactLeafletMap<LeafletMapProps, LeafletMap>>;
  /** the default bounds of the map to zoom out to */
  bounds: LatLngBounds;
};

/**
 * Displays a button that zooms out to show the entire map when clicked
 * @param map The leaflet map
 * @param bounds The latlng bounds to zoom out to
 */
export const ZoomOutButton: React.FC<ZoomOutProps> = ({ map, bounds }) => {
  const dispatch = useAppDispatch();

  const zoomOut = () => {
    map.current?.leafletElement.fitBounds(bounds);
    const zoom = map.current?.leafletElement.getZoom();
    if (zoom) dispatch(setMapViewZoom(zoom));
  };

  return (
    <ControlPane position="topleft">
      <TooltipWrapper toolTipId="zoomout-id" toolTip="View entire province">
        <ZoomButton onClick={zoomOut}>
          <FaExpandArrowsAlt />
        </ZoomButton>
      </TooltipWrapper>
    </ControlPane>
  );
};
