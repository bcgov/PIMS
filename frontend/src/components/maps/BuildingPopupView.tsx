import './BuildingPopupView.scss';

import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IBuilding } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { EvaluationKeys } from '../../constants/evaluationKeys';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Link, useLocation } from 'react-router-dom';
import Claims from 'constants/claims';
import queryString from 'query-string';
import { useLeaflet } from 'react-leaflet';

export interface IBuildingPopupViewProps {
  building: IBuilding | null;
  /** Zoom level that the map should zoom to. */
  zoomTo?: () => void;
  /** Whether the Popup action menu is disabled. */
  disabled?: boolean;
  /** Event is fired when a link on the popup is clicked. */
  onLinkClick?: () => void;
}

/**
 * Display the specified property information.
 * @param props BuildingPopupView properties.
 */
export const BuildingPopupView: React.FC<IBuildingPopupViewProps> = (
  props: IBuildingPopupViewProps,
) => {
  const keycloak = useKeycloakWrapper();
  const buildingDetail: IBuilding | null | undefined = props?.building;
  const location = useLocation();

  const leaflet = useLeaflet();
  const defaultZoom = () =>
    leaflet.map?.flyTo(
      [buildingDetail!.latitude as number, buildingDetail!.longitude as number],
      14,
    );

  const whichZoom = props?.zoomTo ?? defaultZoom;
  const curZoom = leaflet.map?.getZoom();

  return (
    <Container className="buildingPopup" fluid={true}>
      {!buildingDetail ? (
        <Alert variant="warning">Property details loading.</Alert>
      ) : (
        <>
          <Row>
            <Col>
              <ListGroup>
                <ListGroup.Item className="name">{buildingDetail?.name}</ListGroup.Item>
                {buildingDetail?.name !== buildingDetail?.description ? (
                  <ListGroup.Item>{buildingDetail?.description}</ListGroup.Item>
                ) : null}
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <Label>Assessed Value:</Label>
                  {buildingDetail?.evaluations?.length &&
                    '$' +
                      buildingDetail?.evaluations
                        ?.find(e => e.key === EvaluationKeys.Assessed)
                        ?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </ListGroup.Item>
                {buildingDetail?.address && (
                  <ListGroup.Item>
                    <div>{buildingDetail?.address?.line1}</div>
                    <div>
                      {buildingDetail?.address?.administrativeArea}
                      {buildingDetail?.address?.province &&
                        ', ' + buildingDetail?.address?.province}
                      {buildingDetail?.address?.postal && ' ' + buildingDetail?.address?.postal}
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <Label>Agency:</Label>
                  {buildingDetail?.agency}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Label>Floor Count:</Label>
                  {buildingDetail?.buildingFloorCount}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Label>Predominate Use:</Label>
                  {buildingDetail?.buildingPredominateUse}
                </ListGroup.Item>
                {buildingDetail?.projectNumber && (
                  <ListGroup.Item>
                    <Label>SPP:</Label>
                    {buildingDetail?.projectNumber}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>

          {!props?.disabled && (
            <Row className="menu">
              <Col>
                <Link
                  onClick={() => {
                    props?.onLinkClick && props.onLinkClick();
                  }}
                  to={{
                    pathname: `/mapview`,
                    search: queryString.stringify({
                      ...queryString.parse(location.search),
                      sidebar: true,
                      disabled: true,
                      loadDraft: false,
                      buildingId: buildingDetail?.id,
                      parcelId: undefined,
                    }),
                  }}
                >
                  View
                </Link>

                {(keycloak.hasAgency(buildingDetail?.agencyId as number) ||
                  keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
                  <Link
                    onClick={() => {
                      props?.onLinkClick && props.onLinkClick();
                    }}
                    to={{
                      pathname: `/mapview`,
                      search: queryString.stringify({
                        ...queryString.parse(location.search),
                        disabled: false,
                        sidebar: true,
                        loadDraft: false,
                        buildingId: buildingDetail?.id,
                        parcelId: undefined,
                      }),
                    }}
                  >
                    Update
                  </Link>
                )}
                {curZoom! < 14 && (
                  <Link to={{ ...location }} onClick={whichZoom}>
                    Zoom
                  </Link>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};
