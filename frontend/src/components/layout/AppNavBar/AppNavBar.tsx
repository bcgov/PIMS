import './AppNavBar.scss';

import { Claims } from 'constants/claims';
import { HelpContainer } from 'features/help/containers/HelpContainer';
import { SidebarContextType } from 'features/mapSideBar/hooks/useQueryParamSideBar';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import queryString from 'query-string';
import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Nav bar with role-based functionality.
 */
function AppNavBar() {
  const navigate = useNavigate();
  return (
    <Navbar variant="dark" className="map-nav" expand="lg">
      <Navbar.Toggle aria-controls="collapse" className="navbar-dark mr-auto" />
      <Navbar.Collapse className="links mr-auto">
        <Nav>
          <Nav.Item className="home-button" onClick={() => navigate('/mapview')}>
            <FaHome size={20} />
          </Nav.Item>
          <AdminDropdown />
          <SubmitProperty />
          <ViewInventory />
          <DisposeProjectsDropdown />
          <ReportsDropdown />
        </Nav>
      </Navbar.Collapse>
      <HelpContainer />
    </Navbar>
  );
}

/**
 * Submit Property navigation dropdown item.
 */
function SubmitProperty() {
  const keycloak = useKeycloakWrapper();
  const navigate = useNavigate();
  const location = useLocation();
  return keycloak.hasClaim(Claims.PROPERTY_ADD) ? (
    <Nav.Link
      className={
        location.pathname.includes('mapview') &&
        queryString.parse(location.search).sidebar === 'true'
          ? 'active'
          : 'idle'
      }
      onClick={() =>
        navigate({
          pathname: '/mapview',
          search: queryString.stringify({
            ...queryString.parse(location.search),
            sidebar: true,
            disabled: false,
            loadDraft: false,
            parcelId: undefined,
            buildingId: undefined,
            new: true,
            sidebarContext: SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR,
            sidebarSize: 'narrow',
          }),
        })
      }
    >
      Submit Property
    </Nav.Link>
  ) : null;
}

/**
 * View Inventory navigation item.
 */
function ViewInventory() {
  const keycloak = useKeycloakWrapper();
  const navigate = useNavigate();
  const location = useLocation();
  return keycloak.hasClaim(Claims.PROPERTY_VIEW) ? (
    <Nav.Link
      className={location.pathname.includes('properties/list') ? 'active' : 'idle'}
      onClick={() => navigate('/properties/list')}
    >
      View Property Inventory
    </Nav.Link>
  ) : null;
}

/**
 * Administration dropdown menu.
 */
function AdminDropdown() {
  const keycloak = useKeycloakWrapper();
  const navigate = useNavigate();
  const location = useLocation();
  return keycloak.isAdmin ? (
    <NavDropdown
      className={location.pathname.includes('admin') ? 'active' : 'idle'}
      title="Administration"
      id="administration"
    >
      <NavDropdown.Item onClick={() => navigate('/admin/users')}>Users</NavDropdown.Item>
      <NavDropdown.Item onClick={() => navigate('/admin/access/requests')}>
        Access Requests
      </NavDropdown.Item>
      <NavDropdown.Item onClick={() => navigate('/admin/agencies')}>Agencies</NavDropdown.Item>
      <NavDropdown.Item onClick={() => navigate('/admin/administrativeAreas')}>
        Administrative Areas
      </NavDropdown.Item>
    </NavDropdown>
  ) : null;
}

/**
 * Disposal Projects navigation dropdown menu.
 */
function DisposeProjectsDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
  return keycloak.hasClaim(Claims.PROJECT_VIEW) ||
    keycloak.hasClaim(Claims.DISPOSE_APPROVE) ||
    keycloak.hasClaim(Claims.ADMIN_PROJECTS) ? (
    <NavDropdown
      className={
        location.pathname.includes('dispose') || location.pathname.includes('projects')
          ? 'active'
          : 'idle'
      }
      title="Disposal Projects"
      id="dispose"
    >
      {(keycloak.hasClaim(Claims.PROJECT_ADD) || keycloak.hasClaim(Claims.ADMIN_PROJECTS)) && (
        <NavDropdown.Item onClick={() => navigate('/dispose')}>
          Create Disposal Project
        </NavDropdown.Item>
      )}
      {(keycloak.hasClaim(Claims.PROJECT_VIEW) || keycloak.hasClaim(Claims.ADMIN_PROJECTS)) && (
        <NavDropdown.Item onClick={() => navigate('/projects/list')}>
          View Projects
        </NavDropdown.Item>
      )}
      {(keycloak.hasClaim(Claims.PROJECT_VIEW) || keycloak.hasClaim(Claims.ADMIN_PROJECTS)) && (
        <NavDropdown.Item onClick={() => navigate('/projects/spl')}>
          View SPL Projects
        </NavDropdown.Item>
      )}
      {keycloak.hasClaim(Claims.DISPOSE_APPROVE) && (
        <NavDropdown.Item onClick={() => navigate('/projects/approval/requests')}>
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
  const navigate = useNavigate();
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
  return keycloak.hasClaim(Claims.REPORTS_VIEW) ? (
    <NavDropdown
      className={location.pathname.includes('reports') ? 'active' : 'idle'}
      title="Reports"
      id="reports"
    >
      {keycloak.hasClaim(Claims.REPORTS_SPL) && (
        <NavDropdown.Item onClick={() => navigate('/reports/spl')}>SPL Report</NavDropdown.Item>
      )}
    </NavDropdown>
  ) : null;
}

export default AppNavBar;
