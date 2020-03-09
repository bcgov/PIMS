import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './AppNavBar.scss';
import profileUrl from './profile.svg';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

/**
 * Nav bar with with user-related functionality. TODO: potentially move up to the App.tsx level.
 */
function AppNavBar() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  return (
    <Navbar className="map-nav">
      <Nav>
        <Nav.Item className="profile">
          <Image src={profileUrl} rounded />
        </Nav.Item>
        <NavDropdown title={keycloak.firstName || 'default'} id="user-dropdown">
          {keycloak.isAdmin() ? (
            <NavDropdown.Item onClick={() => history.push('/admin')}>
              Administration
            </NavDropdown.Item>
          ) : null}
          <NavDropdown.Item onClick={() => history.push('/mapview')}>
            Properties Map
          </NavDropdown.Item>
          {history ? (
            <NavDropdown.Item
              onClick={() => {
                history.push('/');
                keycloak.obj!.logout();
              }}
            >
              Sign Out
            </NavDropdown.Item>
          ) : null}
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

export default AppNavBar;
