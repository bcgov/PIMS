import * as React from 'react';
import { Property } from 'actions/propertiesActions';
import { ListGroup, Container } from 'react-bootstrap';

export interface PropertyListProps {
  properties: Property[];
}

export const PropertyList = (props: PropertyListProps) => {
  return <Container fluid={true}>
    {props.properties && props.properties.map && props.properties.map(property =>
      <ListGroup key={property.pid}>
        <ListGroup.Item>Pid: {property.pid}</ListGroup.Item>
        <ListGroup.Item>Pin: {property.pin}</ListGroup.Item>
        <ListGroup.Item>Lat: {property.lat}</ListGroup.Item>
        <ListGroup.Item>Long: {property.long}</ListGroup.Item>
        <ListGroup.Item>Address: {property.address}</ListGroup.Item>
      </ListGroup>)}
  </Container>
}
