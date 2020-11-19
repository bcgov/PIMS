import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { keys } from 'lodash';
import styled from 'styled-components';
import { LatLng } from 'react-leaflet';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export const LayerPopupTitle = styled('div')`
  padding: 16px;
  font-weight: 800;
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
}

/**
 * A component to display the layer details in a popup
 * @param param0
 */
export const LayerPopupContent: React.FC<IPopupContentProps> = ({
  data,
  config,
  center,
  onAddToParcel,
}) => {
  const rows = React.useMemo(() => keys(config), [config]);
  const location = useLocation();
  return (
    <>
      <ListGroup>
        {rows.map(key => (
          <ListGroup.Item key={key}>
            <b>{config[key].label}</b> {config[key].display(data)}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {data.PID !== undefined || data.PIN !== undefined ? (
        <Link
          style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}
          onClick={(e: any) => onAddToParcel(e, { ...data, CENTER: center })}
          to={{
            search: queryString.stringify({
              ...queryString.parse(location.search),
              sidebar: true,
              disabled: false,
              loadDraft: false,
            }),
          }}
        >
          Populate property details
        </Link>
      ) : null}
    </>
  );
};
