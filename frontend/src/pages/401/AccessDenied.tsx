import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const AccessDenied = () => {
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
