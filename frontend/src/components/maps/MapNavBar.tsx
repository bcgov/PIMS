import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './MapNavBar.scss';
import profileUrl from './profile.svg';

/**
 * Nav bar with with user-related functionality. TODO: potentially move up to the App.tsx level.
 */
function MapNavBar() {
  const { keycloak } = useKeycloak();
  const history = useHistory();
  return (
    <Navbar className="map-nav">
      <Nav>
        <Nav.Item className="profile">
          <Image src={profileUrl} rounded />
        </Nav.Item>
        <NavDropdown title={keycloak?.profile?.firstName} id="user-dropdown">
          <NavDropdown.Item
            onClick={() => {
              history.push('/');
              keycloak!.logout();
            }}
          >
            Sign Out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

export default MapNavBar;
