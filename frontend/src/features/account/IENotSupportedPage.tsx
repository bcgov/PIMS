import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * The IENotSupportedPage prevents users from entering PIMS
 * if they are using any version of Internet Explorer, as most
 * libraries no longer support IE.
 */
export const IENotSupportedPage: React.FC = () => {
  return (
    <Container className="unauth" fluid={true}>
      <br></br>
      <h1>PIMS does not support Internet Explorer</h1>
      <br></br>
      <h6>Please use a supported internet browser such as Chrome, Firefox or Edge.</h6>
    </Container>
  );
};
