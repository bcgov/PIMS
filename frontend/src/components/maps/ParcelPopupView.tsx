import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IParcelDetail } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import './ParcelPopupView.scss';

export interface IParcelDetailProps {
  parcelDetail: IParcelDetail | null;
}

export const ParcelPopupView = (props: IParcelDetailProps | null) => {
  const parcelDetail: IParcelDetail | null | undefined = props?.parcelDetail;

  return <Container className="parcelPopup" fluid={true}>
    {!parcelDetail ?
      <Alert variant="danger">Failed to load parcel details.</Alert>
      :
      <Row>
        <Col>
          <ListGroup>
            <ListGroup.Item><Label>Assessed Value: </Label>${parcelDetail?.assessedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</ListGroup.Item>
          </ListGroup>
          <ListGroup>
            <ListGroup.Item>
              <p><Label>Address: </Label>{parcelDetail?.address?.line1}</p>
              <p>{parcelDetail?.address?.city}, {parcelDetail?.address?.province} {parcelDetail?.address?.postal}</p>
            </ListGroup.Item>
            <ListGroup.Item><Label>PID: </Label> {parcelDetail?.pid}</ListGroup.Item>
          </ListGroup>
          <ListGroup>
            <ListGroup.Item><Label>Agency: </Label>{parcelDetail?.agency}</ListGroup.Item>
            <ListGroup.Item><Label>Classification: </Label>{parcelDetail?.propertyClassification}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    }
  </Container >

}
