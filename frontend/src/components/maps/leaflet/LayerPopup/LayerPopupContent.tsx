import { ILTSAOrderModel } from 'actions/parcelsActions';
import { LTSADialog } from 'components/ltsa/LTSADialog';
import { useApi } from 'hooks/useApi';
import { LatLng, LatLngBounds } from 'leaflet';
import { keys } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
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

  // Get LTSA information
  const [ltsaInfoOpen, setLtsaInfoOpen] = React.useState<boolean>(false);
  const [ltsa, setLtsa] = useState<ILTSAOrderModel | undefined>(undefined);
  const api = useApi();

  useEffect(() => {
    getLTSAData();
  }, [data.PID]);

  const getLTSAData = async () => {
    try {
      const ltsaData = await api.getLTSA(data.PID);
      setLtsa(ltsaData);

      data['LEGAL_DESCRIPTION'] =
        ltsaData?.order.orderedProduct.fieldedData.descriptionsOfLand[0].fullLegalDescription ?? '';
    } catch (e) {
      setLtsa(undefined);
    }
  };

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
        {bounds && curZoom! !== boundZoom ? (
          <Col>
            <StyledLink
              to={{ ...location }}
              onClick={() => leaflet.flyToBounds(bounds, { animate: false })}
            >
              Zoom
            </StyledLink>
          </Col>
        ) : null}

        <Col>
          <StyledLink
            to={{ ...location }}
            onClick={() => {
              setLtsaInfoOpen(true);
            }}
          >
            LTSA Info
          </StyledLink>
          <LTSADialog pid={data.PID} {...{ ltsa, ltsaInfoOpen, setLtsaInfoOpen }} />
        </Col>
      </MenuRow>
    </>
  );
};
