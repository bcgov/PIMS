import * as React from 'react';
import { IProperty } from 'actions/parcelsActions';
import { ListGroup, Container } from 'react-bootstrap';

export interface IParcelListProps {
  parcels: IProperty[];
}

export const ParcelList = (props: IParcelListProps) => {
  return (
    <Container fluid={true}>
      <h1>Parcel List:</h1>
      {props.parcels &&
        props.parcels.map &&
        props.parcels.map(parcel => (
          <ListGroup key={parcel.id}>
            <ListGroup.Item>Latitude: {parcel.latitude}</ListGroup.Item>
            <ListGroup.Item>Longitude: {parcel.longitude}</ListGroup.Item>
          </ListGroup>
        ))}
    </Container>
  );
};
