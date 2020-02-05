import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';

export const ParcelDetailView = (props) => {
  return <Container fluid={true}>
    <h1>Parcel Detail:</h1>
    <ListGroup key={props.parcelDetail?.id}>
      {props.parcelDetail && Object.keys(props.parcelDetail).map(key =>
        <ListGroup.Item key={key}>{key}: {JSON.stringify(props.parcelDetail[key])}</ListGroup.Item>
      )}
    </ListGroup>
  </Container>
}
