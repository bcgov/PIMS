import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import './ParcelPopupView.scss';
import { Link } from 'react-router-dom';

export interface IParcelDetailProps {
  parcel: IParcel | null;
  disabled?: boolean;
}

export const ParcelPopupView = (props: IParcelDetailProps | null) => {
  const parcelDetail: IParcel | null | undefined = props?.parcel;

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
                  ?.find(() => true)
                  ?.assessedValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
            {parcelDetail?.id && !props?.disabled && (
              <Link to={`/submitProperty/${parcelDetail?.id}?disabled=true`}>View</Link>
            )}
            {parcelDetail?.id && !props?.disabled && (
              <Link style={{ marginLeft: '8px' }} to={`/submitProperty/${parcelDetail?.id}`}>
                Update
              </Link>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};
