import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import MapView from './features/properties/map/MapView';
import AccessRequestPage from './features/admin/access-request/AccessRequestPage';
import EditUserPage from './features/admin/edit-user/EditUserPage';
import Login from './features/account/Login';
import AccessDenied from './pages/401/AccessDenied';
import SubmitProperty from 'features/properties/submit/SubmitProperty';
import { ManageUsersPage } from 'features/admin/users/ManageUsersPage';
import ManageAccessRequests from 'features/admin/access/ManageAccessRequests';
import { Claims } from 'constants/claims';
import AppRoute from 'utils/AppRoute';
import PublicLayout from 'layouts/PublicLayout';
import AuthLayout from 'layouts/AuthLayout';
import Test from 'pages/Test.ignore';
import { PropertyListView } from 'features/properties/list';
import { NotFoundPage } from 'pages/404/NotFoundPage';
import ProjectDisposalSubmitted from 'features/projects/dispose/ProjectDisposalSubmitted';
import { ProjectListView, ProjectApprovalRequestListView } from 'features/projects/list';
import { LogoutPage } from 'features/account/Logout';
import { ProjectRouter } from 'features/projects/common';
import { ProjectDisposeView } from 'features/projects/dispose';

const AppRouter: React.FC = () => {
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
        component={ManageUsersPage}
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
        path="/mapView"
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
        path="/project/completed"
        component={ProjectDisposalSubmitted}
        layout={AuthLayout}
        claim={Claims.PROJECT_VIEW}
        title={getTitle('Dispose Property Complete')}
      />
      <AppRoute
        protected
        path="/submitProperty/:id?"
        component={SubmitProperty}
        layout={AuthLayout}
        claim={Claims.PROPERTY_ADD}
        title={getTitle('Submit Property')}
      />
      <AppRoute
        protected
        path="/admin/user/:id?"
        component={EditUserPage}
        layout={AuthLayout}
        claim={Claims.ADMIN_USERS}
        title={getTitle('Edit User')}
      />
      <AppRoute title="*" path="*" component={() => <Redirect to="/page-not-found" />} />
    </Switch>
  );
};

export default AppRouter;
