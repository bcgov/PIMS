import { LatLng, LatLngBounds } from 'leaflet';
import { keys } from 'lodash';
import * as React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { useMap } from 'react-leaflet';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const LayerPopupTitle = styled('div')`
  padding: 16px;
  font-weight: 800;
`;

export const MenuRow = styled(Row)`
  text-align: center;
  padding-bottom: 10px;
`;

export const StyledLink = styled(Link)`
  padding: 0 4px;
`;

export type PopupContentConfig = {
  [key: string]: {
    label: string;
    display: (data: { [key: string]: string }) => string | React.ReactNode;
  };
};

export interface IPopupContentProps {
  /**
   * Data coming from the GeoJSON feature.properties
   * @property
   * @example
   * feature: {
   *  properties: {
   *    'ADMIN_AREA_ID': 1,
   *    'ADMIN_AERA_NAME: 'West Saanich'
   *  }
   * }
   */
  data: { [key: string]: string };
  /**
   * A configuration used to display the properties fields in the popup content
   * @property
   * @example
   * {ADMIN_AREA_SQFT: (data: any) => `${data.ADMIN_AREA_SQFT} ft^2`}
   */
  config: PopupContentConfig;
  center?: LatLng;
  onAddToParcel: (e: MouseEvent, data: { [key: string]: any }) => void;
  bounds?: LatLngBounds;
}

/**
 * A component to display the layer details in a popup
 * @param param0
 */
export const LayerPopupContent: React.FC<IPopupContentProps> = ({ data, config, bounds }) => {
  const rows = React.useMemo(() => keys(config), [config]);
  const location = useLocation();

  const leaflet = useMap();
  const curZoom = leaflet.getZoom();
  const boundZoom = leaflet.getBoundsZoom(bounds!);

  return (
    <>
      <ListGroup>
        {rows.map((key) => (
          <ListGroup.Item key={key}>
            <b>{config[key].label}</b> {config[key].display(data)}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <MenuRow>
        <Col>
          {bounds && curZoom! !== boundZoom ? (
            <StyledLink
              to={{ ...location }}
              onClick={() => leaflet.flyToBounds(bounds, { animate: false })}
            >
              Zoom
            </StyledLink>
          ) : null}
        </Col>
      </MenuRow>
    </>
  );
};
