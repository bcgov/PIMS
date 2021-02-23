import React, { useLayoutEffect } from 'react';
import { Switch, Redirect, useLocation } from 'react-router-dom';
import MapView from './features/properties/map/MapView';
import AccessRequestPage from './features/admin/access-request/AccessRequestPage';
import EditUserPage from './features/admin/edit-user/EditUserPage';
import Login from './features/account/Login';
import AccessDenied from './pages/401/AccessDenied';
import { ManageUsers } from 'features/admin/users/ManageUsers';
import ManageAccessRequests from 'features/admin/access/ManageAccessRequests';
import { Claims } from 'constants/claims';
import AppRoute from 'utils/AppRoute';
import PublicLayout from 'layouts/PublicLayout';
import AuthLayout from 'layouts/AuthLayout';
import Test from 'pages/Test.ignore';
import { PropertyListView } from 'features/properties/list';
import { NotFoundPage } from 'pages/404/NotFoundPage';
import {
  ProjectDisposalSubmitted,
  ProjectDisposalExemptionSubmitted,
} from 'features/projects/dispose';
import { ProjectListView, ProjectApprovalRequestListView } from 'features/projects/list';
import { LogoutPage } from 'features/account/Logout';
import { ProjectRouter } from 'features/projects/common';
import { ProjectDisposeView } from 'features/projects/dispose';
import SplReportContainer from 'features/splReports/containers/SplReportContainer';
import ManageAgencies from 'features/admin/agencies/ManageAgencies';
import EditAgencyPage from 'features/admin/agencies/EditAgencyPage';
import { IENotSupportedPage } from 'features/account/IENotSupportedPage';

const AppRouter: React.FC = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const getTitle = (page: string) => {
    return `PIMS${' - ' + page}`;
  };
  return (
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
        path="/test"
        title={getTitle('Test')}
        component={Test}
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
        path="/reports/spl"
        component={SplReportContainer}
        layout={AuthLayout}
        claim={Claims.REPORTS_SPL}
        title={getTitle('Dispose Property')}
      />
      <AppRoute title="*" path="*" component={() => <Redirect to="/page-not-found" />} />
    </Switch>
  );
};

export default AppRouter;
