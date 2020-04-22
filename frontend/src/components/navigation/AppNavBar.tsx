import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './AppNavBar.scss';
import profileUrl from './profile.svg';
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
    <Navbar className="map-nav" expand="lg">
      <Navbar.Toggle aria-controls="collapse" className="navbar-dark" />
      <Nav>
        <Navbar.Collapse className="links">
          <AdminDropdown />
          <PropertyDropdown />
          <ViewProjects />
          <DisposeRequest />
          <DisposeApprove />
        </Navbar.Collapse>
        <Nav.Item className="profile">
          <Image src={profileUrl} rounded />
        </Nav.Item>
        <NavDropdown title={displayName} id="user-dropdown">
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
  return keycloak.hasClaim(Claims.PROPERTY_VIEW) ? (
    <NavDropdown title="Manage Property" id="manage-property-dropdown">
      <SubmitPropertyNav />
      <NavDropdown.Item>View Inventory</NavDropdown.Item>
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
 * Start a Project navigation dropdown menu.
 */
function DisposeRequest() {
  const keycloak = useKeycloakWrapper();
  return keycloak.hasClaim(Claims.DISPOSE_REQUEST) ? (
    <NavDropdown title="Start a Project" id="start-project-dropdown">
      <NavDropdown.Item>Acquisition Project</NavDropdown.Item>
      <NavDropdown.Item>Disposition Project</NavDropdown.Item>
      <NavDropdown.Item>Request Exemption</NavDropdown.Item>
    </NavDropdown>
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
