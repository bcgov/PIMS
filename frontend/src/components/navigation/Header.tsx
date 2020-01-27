import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { Image, Navbar, Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Header.scss';
import logoUrl from './logo-banner.svg';
import logout from './logout.svg';

function Header() {
  const history = useHistory();
  const { keycloak } = useKeycloak();
  //example of how to check role: const isAdmin = keycloak?.realmAccess?.roles.includes(USER_ROLES[Permission.ADMIN]) == true;
  return (
    <Navbar fixed="top" expand="xl" className="App-header">
      <Container className="bar" fluid={true}>
        <Row>
          <Col>
            <Row className="brand-box">
              <Col md={2} lg={2}></Col>
              <Col xs={1} sm={12} md={2} lg={1} className="brand">
                <Navbar.Brand href="https://gov.bc.ca" >
                  <img className="bc-gov-icon"
                    src={logoUrl}
                    width="156"
                    height="43"
                    alt="Go to the Government of British Columbia website"
                  />
                </Navbar.Brand>
              </Col>
              <Col xs={11} sm={12} md={8} lg={7} className="title">Property Inventory Management System</Col>
            </Row>
          </Col>
          <Col xs={2} sm={1} md={1} lg={1} className="other">
            {!!keycloak?.authenticated ? (
              <div className="exit" onClick={() => {
                history.push('/');
                keycloak.logout();
              }}>
                <Image src={logout} width="34" height="34" alt="exit"></Image>
                <p>Sign-out</p>
              </div>
            ) : (<span></span>)}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;


