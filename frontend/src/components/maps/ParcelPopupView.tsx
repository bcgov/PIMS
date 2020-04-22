import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import './ParcelPopupView.scss';
import { Link } from 'react-router-dom';
import { EvaluationKeys } from '../../constants/evaluationKeys';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

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
                  {parcelDetail?.address?.city}, {parcelDetail?.address?.province}{' '}
                  {parcelDetail?.address?.postal}
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>PID: </Label> {parcelDetail?.pid}
              </ListGroup.Item>
              {parcelDetail?.projectNumber && (
                <ListGroup.Item>
                  <Label>RAEG or SPP:</Label> {parcelDetail?.projectNumber}
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
          <Col>
            {parcelDetail?.id &&
              !props?.disabled &&
              (!keycloak.hasAgency(parcelDetail?.agencyId) ? (
                <Link to={`/submitProperty/${parcelDetail?.id}?disabled=true`}>View</Link>
              ) : (
                <Link to={`/submitProperty/${parcelDetail?.id}`}>Update</Link>
              ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};
