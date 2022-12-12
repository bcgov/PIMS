import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AccessDenied = () => {
  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h1>Access Denied</h1>
          <h2>You do not have permission to view this page</h2>
          <Link to="/mapview">Go back to the map</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDenied;
