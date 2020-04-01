import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './AppNavBar.scss';
import profileUrl from './profile.svg';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Roles } from 'constants/strings';

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

  const getRoleBasedLinks = () => {
    if (
      keycloak.hasRole(Roles.ASSISTANT_DEPUTY_MINISTER) ||
      keycloak.hasRole(Roles.ASSISTANT_DEPUTY_MINISTER_ASSISTANT) ||
      keycloak.hasRole(Roles.EXECUTIVE_DIRECTOR)
    ) {
      return (
        <Navbar.Collapse className="links">
          <ManagePropertyDropDown />
          <StartProjectDropdown />
          <Nav.Link>View Projects</Nav.Link>
          <Nav.Link>Approval Requests</Nav.Link>
        </Navbar.Collapse>
      );
    } else if (keycloak.hasRole(Roles.REAL_ESTATE_MANAGER)) {
      return (
        <Navbar.Collapse className="links">
          <ManagePropertyDropDown />
          <StartProjectDropdown />
          <Nav.Link>View Projects</Nav.Link>
        </Navbar.Collapse>
      );
    } else if (keycloak.isAdmin) {
      return (
        <Navbar.Collapse className="links">
          <Nav.Link onClick={() => history.push('/admin/requests')}>Access Requests</Nav.Link>
          <Nav.Link onClick={() => history.push('/admin/users')}>User Management</Nav.Link>
        </Navbar.Collapse>
      );
    }
  };

  return (
    <Navbar className="map-nav" expand="lg">
      <Navbar.Toggle aria-controls="collapse" className="navbar-dark" />
      <Nav>
        {getRoleBasedLinks()}
        <Nav.Item className="profile">
          <Image src={profileUrl} rounded />
        </Nav.Item>
        <NavDropdown title={keycloak.firstName || 'default'} id="user-dropdown">
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
