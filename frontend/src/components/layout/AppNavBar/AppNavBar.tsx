import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './AppNavBar.scss';
import profileUrl from 'assets/images/profile.svg';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';
import { useConfiguration } from 'hooks/useConfiguration';
import { FaHome } from 'react-icons/fa';
import queryString from 'query-string';

/**
 * Nav bar with role-based functionality.
 */
function AppNavBar() {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  const displayName =
    keycloak.displayName ??
    (!!keycloak.firstName && !!keycloak.lastName
      ? `${keycloak.firstName} ${keycloak.lastName}`
      : 'default');
  const configuration = useConfiguration();

  return (
    <Navbar variant="dark" className="map-nav" expand="lg">
      <Navbar.Toggle aria-controls="collapse" className="navbar-dark mr-auto" />
      <Navbar.Collapse className="links mr-auto">
        <Nav>
          <Nav.Item className="home-button" onClick={() => history.push('/mapview')}>
            <FaHome size={20} />
          </Nav.Item>
          <AdminDropdown />
          <PropertyDropdown />
          <DisposeProjectsDropdown />
          <ReportsDropdown />
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
                keycloak.obj!.logout({ redirectUri: `${configuration.baseUrl}/logout` });
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
    <NavDropdown.Item
      onClick={() =>
        history.push({
          pathname: '/mapview',
          search: queryString.stringify({
            ...queryString.parse(history.location.search),
            sidebar: true,
            disabled: false,
            loadDraft: false,
            new: true,
          }),
        })
      }
    >
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
    <NavDropdown
      className={
        history.location.pathname.includes('mapview') ||
        (history.location.pathname.includes('properties') &&
          !history.location.pathname.includes('projects'))
          ? 'active'
          : 'idle'
      }
      title="Manage Property"
      id="manage-property-dropdown"
    >
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
    <NavDropdown
      className={history.location.pathname.includes('admin') ? 'active' : 'idle'}
      title="Administration"
      id="administration"
    >
      <NavDropdown.Item onClick={() => history.push('/admin/users')}>Users</NavDropdown.Item>
      <NavDropdown.Item onClick={() => history.push('/admin/access/requests')}>
        Access Requests
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => history.push('/admin/agencies')}>Agencies</NavDropdown.Item>
    </NavDropdown>
  ) : null;
}

/**
 * Disposal Projects navigation dropdown menu.
 */
function DisposeProjectsDropdown() {
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  // admin-projects and admin-properties roles are needed to Create/View projects,
  // but only dispose-approve is needed to see Approval requests
  return (keycloak.hasClaim(Claims.ADMIN_PROPERTIES) && keycloak.hasClaim(Claims.ADMIN_PROJECTS)) ||
    keycloak.hasClaim(Claims.DISPOSE_APPROVE) ? (
    <NavDropdown
      className={
        history.location.pathname.includes('dispose') ||
        history.location.pathname.includes('projects')
          ? 'active'
          : 'idle'
      }
      title="Disposal Projects"
      id="dispose"
    >
      {keycloak.hasClaim(Claims.ADMIN_PROPERTIES) && keycloak.hasClaim(Claims.ADMIN_PROJECTS) && (
        <>
          <NavDropdown.Item onClick={() => history.push('/dispose')}>
            Create Disposal Project
          </NavDropdown.Item>
          <NavDropdown.Item onClick={() => history.push('/projects/list')}>
            View Projects
          </NavDropdown.Item>
        </>
      )}
      {keycloak.hasClaim(Claims.DISPOSE_APPROVE) && (
        <NavDropdown.Item onClick={() => history.push('/projects/approval/requests')}>
          Approval Requests
        </NavDropdown.Item>
      )}
    </NavDropdown>
  ) : null;
}

/**
 * Reports navigation dropdown menu.
 */
function ReportsDropdown() {
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  return keycloak.hasClaim(Claims.REPORTS_VIEW) ? (
    <NavDropdown
      className={history.location.pathname.includes('reports') ? 'active' : 'idle'}
      title="Reports"
      id="reports"
    >
      {keycloak.hasClaim(Claims.REPORTS_SPL) && (
        <NavDropdown.Item onClick={() => history.push('/reports/spl')}>SPL Report</NavDropdown.Item>
      )}
    </NavDropdown>
  ) : null;
}

export default AppNavBar;
