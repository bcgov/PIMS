import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { keys } from 'lodash';
import styled from 'styled-components';

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
}

/**
 * A component to display the layer details in a popup
 * @param param0
 */
export const LayerPopupContent: React.FC<IPopupContentProps> = ({ data, config }) => {
  const rows = React.useMemo(() => keys(config), [config]);
  return (
    <ListGroup>
      {rows.map(key => (
        <ListGroup.Item key={key}>
          <b>{config[key].label}</b> {config[key].display(data)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
