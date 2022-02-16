import './Login.scss';

import PIMSlogo from 'assets/images/PIMSlogo/logo_with_text.png';
import FilterBackdrop from 'components/maps/leaflet/FilterBackdrop';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

/**
 * Display a placeholder of the PIMS login screen when keycloak is being initialized.
 */
const LoginLoading = () => {
  return (
    <Container className="login" fluid={true}>
      <FilterBackdrop show={true}></FilterBackdrop>
      <Container className="unauth" fluid={true}>
        <img className="pims-logo" src={PIMSlogo} alt="PIMS logo" />
        <Row className="sign-in">
          <Col xs={1} md={3} />
          <Col xs={16} md={6} className="block">
            <h1>Search and visualize government property information</h1>
            <h6>
              PIMS enables you to search properties owned by the Government of British Columbia
            </h6>
            <p>
              The data provided can assist your agency in making informed, timely, and strategic
              decisions on the optimal use of real property assets on behalf of the people and
              priorities of British Columbia.
            </p>
            <Button variant="primary" disabled={true}>
              Sign In
            </Button>
            <p>Sign into PIMS with your government issued IDIR or with your Business BCeID.</p>
            <Row></Row>
          </Col>
          <Col xs={1} md={3} />
        </Row>
      </Container>
    </Container>
  );
};

export default LoginLoading;
