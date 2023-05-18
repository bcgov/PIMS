import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface INotFoundProps {
  failedRoute?: string;
}

export const NotFoundPage = (props: INotFoundProps) => {
  const { failedRoute = '' } = props;

  useEffect(() => {
    // Send data to Snowplow.
    window.snowplow('trackSelfDescribingEvent', {
      schema: 'iglu:ca.bc.gov.pims/error/jsonschema/1-0-0',
      data: {
        error_message: `Page not found at ${failedRoute}`,
      },
    });
  }, []);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h1>Page not found</h1>
          {failedRoute}
          <Link to="/mapview">Go back to the map</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
