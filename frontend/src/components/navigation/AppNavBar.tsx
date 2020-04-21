import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './AppNavBar.scss';
import profileUrl from './profile.svg';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';

/**
 * Nav bar with with user-related functionality.
 */
function AppNavBar() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();

  const ManagePropertyDropDown = () => (
    <NavDropdown title="Manage Property" id="manage-property-dropdown">
      <NavDropdown.Item onClick={() => history.push('/submitProperty')}>
        Submit Property
      </NavDropdown.Item>
      <NavDropdown.Item>View Inventory</NavDropdown.Item>
    </NavDropdown>
  );

  const StartProjectDropdown = () => (
    <NavDropdown title="Start a Project" id="start-project-dropdown">
      <NavDropdown.Item>Acquisition Project</NavDropdown.Item>
      <NavDropdown.Item>Disposition Project</NavDropdown.Item>
      <NavDropdown.Item>Request Exemption</NavDropdown.Item>
    </NavDropdown>
  );

  const canAdmin = keycloak.isAdmin ? (
    <NavDropdown title="Administration" id="administration">
      <NavDropdown.Item onClick={() => history.push('/admin/users')}>Users</NavDropdown.Item>
      <NavDropdown.Item onClick={() => history.push('/admin/access/requests')}>
        Access Requests
      </NavDropdown.Item>
    </NavDropdown>
  ) : null;

  const canPropertyView = keycloak.hasClaim(Claims.PROPERTY_VIEW) ? (
    <Nav.Link>View Projects</Nav.Link>
  ) : null;

  const canEditProperties = keycloak.hasClaim(Claims.PROPERTY_EDIT) ? (
    <ManagePropertyDropDown />
  ) : null;

  const canDisposeRequest = keycloak.hasClaim(Claims.DISPOSE_REQUEST) ? (
    <StartProjectDropdown />
  ) : null;

  const canDisposeApprove = keycloak.hasClaim(Claims.DISPOSE_APPROVE) ? (
    <Nav.Link>Approval Requests</Nav.Link>
  ) : null;

  const displayName = keycloak.displayName || keycloak.firstName || 'default';

  return (
    <Navbar className="map-nav" expand="lg">
      <Navbar.Toggle aria-controls="collapse" className="navbar-dark" />
      <Nav>
        <Navbar.Collapse className="links">
          {canAdmin}
          {canEditProperties}
          {canPropertyView}
          {canDisposeRequest}
          {canDisposeApprove}
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

export default AppNavBar;
