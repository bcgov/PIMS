import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import './ParcelPopupView.scss';
import { Link, useLocation } from 'react-router-dom';
import { EvaluationKeys } from '../../constants/evaluationKeys';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { fetchProject, IProject } from 'features/projects/common';
import { useEffect, useState } from 'react';
import { useLeaflet } from 'react-leaflet';
import { MAX_ZOOM } from 'constants/strings';

export interface IParcelPopupViewProps {
  /** The property to display */
  parcel: IParcel | null;
  /** Zoom level that the map should zoom to. */
  zoomTo?: () => void;
  /** Whether the Popup action menu is disabled. */
  disabled?: boolean;
  /** Event is fired when a link on the popup is clicked. */
  onLinkClick?: () => void;
}

/**
 * Display the specified property information.
 * @param props ParcelPopupView properties.
 */
export const ParcelPopupView = (props: IParcelPopupViewProps | null) => {
  const parcelDetail: IParcel | null | undefined = props?.parcel;
  const keycloak = useKeycloakWrapper();
  const location = useLocation();
  const dispatch = useDispatch();
  const [projectRoute, setProjectRoute] = useState('');

  const leaflet = useLeaflet();
  const defaultZoom = () =>
    leaflet.map?.flyTo(
      [parcelDetail!.latitude as number, parcelDetail!.longitude as number],
      MAX_ZOOM,
    );
  const jumpToView = () =>
    leaflet.map?.setView(
      [parcelDetail!.latitude as number, parcelDetail!.longitude as number],
      MAX_ZOOM,
    );
  const whichZoom = props?.zoomTo ?? defaultZoom;
  const curZoom = leaflet.map?.getZoom();

  useEffect(() => {
    if (parcelDetail?.projectNumber) {
      (dispatch(fetchProject(parcelDetail?.projectNumber as string)) as any).then(
        (project: IProject) => {
          setProjectRoute(project?.status?.route!);
        },
      );
    }
  }, [dispatch, parcelDetail]);

  return (
    <Container className="parcelPopup" fluid={true}>
      {!parcelDetail ? (
        <Alert variant="warning">Property details loading.</Alert>
      ) : (
        <>
          <Row>
            <Col>
              <ListGroup>
                <ListGroup.Item className="pid">
                  {parcelDetail?.pid ?? parcelDetail?.pin}
                </ListGroup.Item>
                <ListGroup.Item className="name">{parcelDetail?.name}</ListGroup.Item>
                {parcelDetail?.name !== parcelDetail?.description ? (
                  <ListGroup.Item className="description">
                    {parcelDetail?.description}
                  </ListGroup.Item>
                ) : null}
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <Label>Assessed Value:</Label>$
                  {parcelDetail?.evaluations
                    ?.find(e => e.key === EvaluationKeys.Assessed)
                    ?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </ListGroup.Item>
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <div>{parcelDetail?.address?.line1}</div>
                  <div>
                    {parcelDetail?.address?.administrativeArea}, {parcelDetail?.address?.province}{' '}
                    {parcelDetail?.address?.postal}
                  </div>
                </ListGroup.Item>
                {parcelDetail?.projectNumber && (
                  <ListGroup.Item>
                    <Label>SPP:</Label>
                    <Link to={`${projectRoute}?projectNumber=${parcelDetail?.projectNumber}`}>
                      {parcelDetail?.projectNumber}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <Label>Agency:</Label>
                  {parcelDetail?.agency}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Label>Classification: </Label>
                  {parcelDetail?.classification}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {parcelDetail?.id && !props?.disabled && (
            <Row className="menu">
              <Col>
                <Link
                  onClick={() => {
                    if (curZoom! < MAX_ZOOM) jumpToView();
                    props?.onLinkClick && props.onLinkClick();
                  }}
                  to={{
                    pathname: `/mapview`,
                    search: queryString.stringify({
                      ...queryString.parse(location.search),
                      sidebar: true,
                      disabled: true,
                      loadDraft: false,
                      parcelId: parcelDetail?.id,
                      buildingId: undefined,
                    }),
                  }}
                >
                  View
                </Link>
                {(keycloak.hasAgency(parcelDetail?.agencyId as number) ||
                  keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
                  <Link
                    onClick={() => {
                      if (curZoom! < MAX_ZOOM) jumpToView();
                      props?.onLinkClick && props.onLinkClick();
                    }}
                    to={{
                      pathname: `/mapview`,
                      search: queryString.stringify({
                        ...queryString.parse(location.search),
                        sidebar: true,
                        disabled: false,
                        loadDraft: false,
                        parcelId: parcelDetail?.id,
                        buildingId: undefined,
                      }),
                    }}
                  >
                    Update
                  </Link>
                )}
                {curZoom! < MAX_ZOOM && (
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
