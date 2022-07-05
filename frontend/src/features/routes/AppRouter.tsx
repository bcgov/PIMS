import FilterBackdrop from 'components/maps/leaflet/FilterBackdrop';
import { Claims } from 'constants/claims';
import { IENotSupportedPage } from 'features/account/IENotSupportedPage';
import { LogoutPage } from 'features/account/Logout';
import { ProjectLayout } from 'features/projects/disposals';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import { NotFoundPage } from 'pages/404/NotFoundPage';
import React, { lazy, Suspense, useLayoutEffect } from 'react';
import { Col } from 'react-bootstrap';
import { Redirect, Switch, useLocation } from 'react-router-dom';
import AppRoute from 'utils/AppRoute';

import AccessDenied from '../../pages/401/AccessDenied';
import Login from '../account/Login';

const MapView = lazy(() => import('../properties/map/MapView'));
const AccessRequestPage = lazy(() => import('../admin/access-request/AccessRequestPage'));
const EditUserPage = lazy(() => import('../admin/edit-user/EditUserPage'));
const ManageAccessRequests = lazy(() => import('features/admin/access/ManageAccessRequests'));
const ProjectDisposalSubmitted = lazy(() =>
  import('features/projects/dispose/ProjectDisposalSubmitted'),
);
const ProjectDisposalExemptionSubmitted = lazy(() =>
  import('features/projects/dispose/ProjectDisposalExemptionSubmitted'),
);
const ProjectListView = lazy(() => import('features/projects/list/ProjectListView'));
const ProjectApprovalRequestListView = lazy(() =>
  import('features/projects/list/ProjectApprovalRequestListView'),
);
const SPLProjectListView = lazy(() => import('features/projects/list/SPLProjectListView'));
const ProjectRouter = lazy(() => import('features/projects/common/ProjectRouter'));
const ProjectDisposeView = lazy(() => import('features/projects/dispose/ProjectDisposeView'));
const SplReportContainer = lazy(() => import('features/splReports/containers/SplReportContainer'));
const ManageAgencies = lazy(() => import('features/admin/agencies/ManageAgencies'));
const EditAgencyPage = lazy(() => import('features/admin/agencies/EditAgencyPage'));
const ManageAdminAreas = lazy(() => import('features/admin/admin-areas/ManageAdminAreas'));
const ManageUsers = lazy(() => import('features/admin/users/ManageUsers'));
const EditAdminArea = lazy(() => import('features/admin/admin-areas/EditAdminArea'));
const PropertyListView = lazy(() => import('features/properties/list/PropertyListView'));

export const AppRouter: React.FC = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const getTitle = (page: string) => {
    return `PIMS${' - ' + page}`;
  };
  const keycloak = useKeycloakWrapper();
  return (
    <Suspense
      fallback={
        keycloak.obj.authenticated ? (
          <AuthLayout>
            <FilterBackdrop show={true}></FilterBackdrop>
          </AuthLayout>
        ) : (
          <PublicLayout>
            <Col>
              <FilterBackdrop show={true}></FilterBackdrop>
            </Col>
          </PublicLayout>
        )
      }
    >
      <Switch>
        <Redirect exact from="/" to="/login" />
        <AppRoute
          path="/login"
          title={getTitle('Login')}
          component={Login}
          layout={PublicLayout}
        ></AppRoute>
        <AppRoute
          path="/ienotsupported"
          title={getTitle('IE Not Supported')}
          component={IENotSupportedPage}
          layout={PublicLayout}
        ></AppRoute>
        <AppRoute path="/logout" title={getTitle('Logout')} component={LogoutPage}></AppRoute>
        <AppRoute
          path="/forbidden"
          title={getTitle('Forbidden')}
          component={AccessDenied}
          layout={PublicLayout}
        ></AppRoute>
        <AppRoute
          path="/page-not-found"
          title={getTitle('Page Not Found')}
          component={NotFoundPage}
          layout={PublicLayout}
        ></AppRoute>
        <AppRoute
          protected
          path="/admin/users"
          component={ManageUsers}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Users Management')}
        ></AppRoute>
        <AppRoute
          protected
          path="/admin/access/requests"
          component={ManageAccessRequests}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Access Requests')}
        ></AppRoute>
        <AppRoute
          protected
          path="/access/request"
          component={AccessRequestPage}
          layout={AuthLayout}
          title={getTitle('Request Access')}
        ></AppRoute>
        <AppRoute
          protected
          path="/mapView/:id?"
          component={MapView}
          layout={AuthLayout}
          claim={Claims.PROPERTY_VIEW}
          title={getTitle('Map View')}
        />
        <AppRoute
          protected
          path="/properties/list"
          component={PropertyListView}
          layout={AuthLayout}
          claim={Claims.PROPERTY_VIEW}
          title={getTitle('View Inventory')}
        />
        <AppRoute
          protected
          path="/dispose"
          component={ProjectDisposeView}
          layout={AuthLayout}
          claim={Claims.PROJECT_ADD}
          title={getTitle('Dispose Property')}
        />
        <AppRoute
          protected
          path="/projects/list"
          component={ProjectListView}
          layout={AuthLayout}
          claim={Claims.PROJECT_VIEW}
          title={getTitle('View Projects')}
        />
        <AppRoute
          protected
          path="/projects/disposal"
          component={ProjectLayout}
          layout={AuthLayout}
          claim={Claims.PROJECT_ADD}
          title={getTitle('Disposal Project')}
        />
        <AppRoute
          protected
          path="/projects/spl"
          component={SPLProjectListView}
          layout={AuthLayout}
          claim={Claims.PROJECT_VIEW}
          title={getTitle('View SPL Projects')}
        />
        <AppRoute
          protected
          path="/projects/approval/requests"
          component={ProjectApprovalRequestListView}
          layout={AuthLayout}
          claim={Claims.DISPOSE_APPROVE}
          title={getTitle('Surplus Property Program Projects - Approval Requests')}
        />
        <AppRoute
          protected
          path="/projects"
          component={ProjectRouter}
          layout={AuthLayout}
          claim={Claims.PROJECT_ADD}
          title={getTitle('Dispose Property')}
        />
        <AppRoute
          protected
          path="/project/submitted"
          component={ProjectDisposalSubmitted}
          layout={AuthLayout}
          claim={Claims.PROJECT_VIEW}
          title={getTitle('Dispose Property Submitted')}
        />
        <AppRoute
          protected
          path="/project/exemption/submitted"
          component={ProjectDisposalExemptionSubmitted}
          layout={AuthLayout}
          claim={Claims.PROJECT_VIEW}
          title={getTitle('Dispose Property Submitted')}
        />
        <AppRoute
          protected
          path="/admin/user/:id?"
          component={EditUserPage}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Edit User')}
        />
        <AppRoute
          protected
          path="/admin/agencies"
          component={ManageAgencies}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Agency Management')}
        />
        <AppRoute
          protected
          path="/admin/agency/:id"
          component={EditAgencyPage}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Edit Agency')}
        />
        <AppRoute
          protected
          path="/admin/agency/new"
          component={EditAgencyPage}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Edit Agency')}
        />
        <AppRoute
          protected
          path="/admin/administrativeAreas"
          component={ManageAdminAreas}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Adminstrative Areas')}
        />
        <AppRoute
          protected
          path="/admin/administrativeArea/:id"
          component={EditAdminArea}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Edit Adminstrative Area')}
        />
        <AppRoute
          protected
          path="/admin/administrativeArea/new"
          component={EditAdminArea}
          layout={AuthLayout}
          claim={Claims.ADMIN_USERS}
          title={getTitle('Create Administrative Area')}
        />
        <AppRoute
          protected
          path="/reports/spl"
          component={SplReportContainer}
          layout={AuthLayout}
          claim={Claims.REPORTS_SPL}
          title={getTitle('SPL Reports')}
        />
        <AppRoute title="*" path="*" component={() => <Redirect to="/page-not-found" />} />
      </Switch>
    </Suspense>
  );
};

export default AppRouter;
