import * as React from 'react';
import * as propertiesActions from 'actions/propertiesActions';
import { ListGroup, Container } from 'react-bootstrap';

export interface PropertyDetailProps {
  propertyDetail: propertiesActions.PropertyDetail | null;
}

export const PropertyDetailView = (props: PropertyDetailProps) => {
  return <Container fluid={true}>
      <ListGroup>
        <ListGroup.Item>Pid: {props.propertyDetail?.pid}</ListGroup.Item>
        <ListGroup.Item>Pin: {props.propertyDetail?.name}</ListGroup.Item>
        <ListGroup.Item>Lat: {props.propertyDetail?.propertyDetail1}</ListGroup.Item>
        <ListGroup.Item>Long: {props.propertyDetail?.propertyDetail2}</ListGroup.Item>
      </ListGroup>
  </Container>
}
