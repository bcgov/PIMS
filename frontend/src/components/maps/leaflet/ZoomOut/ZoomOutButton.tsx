import * as React from 'react';
import Control from 'react-leaflet-control';
import { Button } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import styled from 'styled-components';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { LatLngBounds, Map as LeafletMap } from 'leaflet';
import { MapProps as LeafletMapProps, Map as ReactLeafletMap } from 'react-leaflet';
import variables from '_variables.module.scss';

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
  const zoomOut = () => {
    map.current?.leafletElement.fitBounds(bounds);
  };
  return (
    <Control position="topleft">
      <TooltipWrapper toolTipId="zoomout-id" toolTip="View entire province">
        <ZoomButton onClick={zoomOut}>
          <FaExpandArrowsAlt />
        </ZoomButton>
      </TooltipWrapper>
    </Control>
  );
};
