import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

/**
 * The IENotSupportedPage prevents users from entering PIMS
 * if they are using any version of Internet Explorer, as most
 * libraries no longer support IE.
 */
export const IENotSupportedPage: React.FC = () => {
  return (
    <Container className="unauth" fluid={true}>
      <h1>PIMS does not support Internet Explorer</h1>
      <Row className="sign-in">
        <Col xs={16} md={6} className="block">
          <h6>Please use a supported internet browser such as Chrome, Firefox or Edge.</h6>
        </Col>
      </Row>
    </Container>
  );
};
