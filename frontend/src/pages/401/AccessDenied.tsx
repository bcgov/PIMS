import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AccessDenied = () => {
  useEffect(() => {
    // Send data to Snowplow.
    window.snowplow('trackSelfDescribingEvent', {
      schema: 'iglu:ca.bc.gov.pims/error/jsonschema/1-0-0',
      data: {
        error_message: 'Access Denied at last path',
      },
    });
  }, []);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h1>Access Denied</h1>
          <h2>You do not have permission to view</h2>
          <Link to="/mapview">Go back to the map</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDenied;
