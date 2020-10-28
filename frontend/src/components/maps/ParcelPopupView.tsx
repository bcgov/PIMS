import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import './ParcelPopupView.scss';
import { Link } from 'react-router-dom';
import { EvaluationKeys } from '../../constants/evaluationKeys';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';

export interface IParcelDetailProps {
  parcel: IParcel | null;
  disabled?: boolean;
}

export const ParcelPopupView = (props: IParcelDetailProps | null) => {
  const parcelDetail: IParcel | null | undefined = props?.parcel;
  const keycloak = useKeycloakWrapper();

  return (
    <Container className="parcelPopup" fluid={true}>
      {!parcelDetail ? (
        <Alert variant="danger">Failed to load parcel details.</Alert>
      ) : (
        <Row>
          <Col>
            <ListGroup>
              <ListGroup.Item>
                <Label>Name: </Label>
                {parcelDetail?.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>Description: </Label>
                {parcelDetail?.description}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Label>Assessed Value: </Label>$
                {parcelDetail?.evaluations
                  ?.find(e => e.key === EvaluationKeys.Assessed)
                  ?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <div>
                  <Label>Address: </Label>
                  {parcelDetail?.address?.line1}
                </div>
                <div>
                  {parcelDetail?.address?.administrativeArea}, {parcelDetail?.address?.province}{' '}
                  {parcelDetail?.address?.postal}
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>PID: </Label> {parcelDetail?.pid}
              </ListGroup.Item>
              {parcelDetail?.projectNumber &&
                (keycloak.hasAgency(parcelDetail?.agencyId as number) ||
                  keycloak.hasClaim(Claims.ADMIN_PROJECTS)) && (
                  <ListGroup.Item>
                    <Label>Project Number: </Label>
                    <Link
                      to={`/dispose/projects/assess/properties?projectNumber=${parcelDetail?.projectNumber}`}
                    >
                      {parcelDetail?.projectNumber}
                    </Link>
                  </ListGroup.Item>
                )}
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Label>Agency: </Label>
                {parcelDetail?.agency}
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>Classification: </Label>
                {parcelDetail?.classification}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {parcelDetail?.id && !props?.disabled && (
            <Col>
              <Link to={`/submitProperty/${parcelDetail?.id}?disabled=true`}>View</Link>
              {(keycloak.hasAgency(parcelDetail?.agencyId as number) ||
                keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
                <Link style={{ paddingLeft: '5px' }} to={`/submitProperty/${parcelDetail?.id}`}>
                  Update
                </Link>
              )}
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};
