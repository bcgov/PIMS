import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './AppNavBar.scss';
import profileUrl from 'assets/images/profile.svg';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';

/**
 * Nav bar with with role-based functionality.
 */
function AppNavBar() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  const displayName = keycloak.displayName || keycloak.firstName || 'default';

  return (
    <Navbar variant="dark" className="map-nav" expand="lg">
      <Navbar.Toggle aria-controls="collapse" className="navbar-dark mr-auto" />
      <Navbar.Collapse className="links mr-auto">
        <Nav>
          <AdminDropdown />
          <PropertyDropdown />
          <ViewProjects />
          <DisposeRequest />
          <DisposeApprove />
        </Nav>
      </Navbar.Collapse>
      <Nav className="profile align-items-center">
        <Nav.Item className="profile-icon pr-0">
          <Image src={profileUrl} rounded />
        </Nav.Item>
        <NavDropdown className="px-0" title={displayName} id="user-dropdown">
          {history ? (
            <NavDropdown.Item
              onClick={() => {
                keycloak.obj!.logout('/login');
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

/**
 * Submit Property navigation dropdown item.
 */
function SubmitPropertyNav() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  return keycloak.hasClaim(Claims.PROPERTY_ADD) ? (
    <NavDropdown.Item onClick={() => history.push('/submitProperty')}>
      Submit Property
    </NavDropdown.Item>
  ) : null;
}

/**
 * Manage Property dropdown menu.
 */
function PropertyDropdown() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  return keycloak.hasClaim(Claims.PROPERTY_VIEW) ? (
    <NavDropdown title="Manage Property" id="manage-property-dropdown">
      <SubmitPropertyNav />
      <NavDropdown.Item onClick={() => history.push('/properties/list')}>
        View Inventory
      </NavDropdown.Item>
    </NavDropdown>
  ) : null;
}

/**
 * Administration dropdown menu.
 */
function AdminDropdown() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  return keycloak.isAdmin ? (
    <NavDropdown title="Administration" id="administration">
      <NavDropdown.Item onClick={() => history.push('/admin/users')}>Users</NavDropdown.Item>
      <NavDropdown.Item onClick={() => history.push('/admin/access/requests')}>
        Access Requests
      </NavDropdown.Item>
    </NavDropdown>
  ) : null;
}

/**
 * View Projects navigation menu link.
 */
function ViewProjects() {
  const keycloak = useKeycloakWrapper();
  return keycloak.hasClaim(Claims.PROPERTY_VIEW) ? <Nav.Link>View Projects</Nav.Link> : null;
}

/**
 * Disposal Project navigation dropdown menu.
 */
function DisposeRequest() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  return keycloak.hasClaim(Claims.DISPOSE_REQUEST) ? (
    <Nav.Link onClick={() => history.push('/dispose')}>Dispose Properties</Nav.Link>
  ) : null;
}

/**
 * Approval Requests navigation menu link.
 */
function DisposeApprove() {
  const keycloak = useKeycloakWrapper();
  return keycloak.hasClaim(Claims.DISPOSE_APPROVE) ? <Nav.Link>Approval Requests</Nav.Link> : null;
}

export default AppNavBar;
