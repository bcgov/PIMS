import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h1>Page not found</h1>
          <Link to="/mapview">Go back to the map</Link>
        </Col>
      </Row>
    </Container>
  );
};
