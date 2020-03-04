import React from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import './Header.scss';
import logoUrl from './logo-banner.svg';

function Header() {
  //example of how to check role: const isAdmin = keycloak?.realmAccess?.roles.includes(USER_ROLES[Permission.ADMIN]) == true;
  return (
    <Navbar fixed="top" expand="xl" className="App-header">
      <Container className="bar" fluid={true}>
        <Row>
          <Col>
            <Row className="brand-box">
              <Col md={2} lg={2}></Col>
              <Col xs={8} sm={6} md={4} lg={1} className="brand">
                <Navbar.Brand href="https://gov.bc.ca">
                  <img
                    className="bc-gov-icon"
                    src={logoUrl}
                    width="156"
                    height="43"
                    alt="Go to the Government of British Columbia website"
                  />
                </Navbar.Brand>
              </Col>
              <Col xs={3} sm={4} md={2} lg={7} className="title">
                <h1 className="longAppName">Property Inventory Management System</h1>
                <h1 className="shortAppName">PIMS</h1>
              </Col>
            </Row>
          </Col>
          <Col xs={3} sm={3} md={3} lg={1} className="other"></Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;
