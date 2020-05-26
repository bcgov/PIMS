import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import MapView from './pages/MapView';
import AccessRequestPage from './pages/AccessRequestPage';
import EditUserPage from './pages/EditUserPage';
import Login from './pages/Login';
import AccessDenied from 'pages/AccessDenied';
import SubmitProperty from 'pages/SubmitProperty';
import { ManageUsersPage } from 'pages/admin/users/ManageUsersPage';
import ManageAccessRequests from 'pages/admin/access/ManageAccessRequests';
import { Claims } from 'constants/claims';
import AppRoute from 'utils/AppRoute';
import PublicLayout from 'layouts/PublicLayout';
import AuthLayout from 'layouts/AuthLayout';
import Test from 'pages/Test';
import { PropertyListView } from 'features/properties/list';
import { NotFoundPage } from 'pages/404/NotFoundPage';

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
