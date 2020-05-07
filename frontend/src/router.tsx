import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import MapView from './pages/MapView';
import AccessRequestPage from './pages/AccessRequestPage';
import EditUserPage from './pages/EditUserPage';
import Login from './pages/Login';
import AccessDenied from 'pages/AccessDenied';
import SubmitProperty from 'pages/SubmitProperty';
import ManageUsers from 'pages/admin/users/ManageUsers';
import ManageAccessRequests from 'pages/admin/access/ManageAccessRequests';
import { Claims } from 'constants/claims';
import AppRoute from 'utils/AppRoute';
import PublicLayout from 'layouts/PublicLayout';
import AuthLayout from 'layouts/AuthLayout';
import Test from 'pages/Test';
import { PropertyListView } from 'features/properties/list';
import { NotFoundPage } from 'pages/404/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/login" />
      <AppRoute path="/login" component={Login} layout={PublicLayout}></AppRoute>
      <AppRoute path="/forbidden" component={AccessDenied} layout={PublicLayout}></AppRoute>
      <AppRoute path="/page-not-found" component={NotFoundPage} layout={PublicLayout}></AppRoute>
      <AppRoute path="/test" component={Test} layout={PublicLayout}></AppRoute>
      <AppRoute
        protected
        path="/admin/users"
        component={ManageUsers}
        layout={AuthLayout}
        claim={Claims.ADMIN_USERS}
      ></AppRoute>
      <AppRoute
        protected
        path="/admin/access/requests"
        component={ManageAccessRequests}
        layout={AuthLayout}
        claim={Claims.ADMIN_USERS}
      ></AppRoute>
      <AppRoute
        protected
        path="/access/request"
        component={AccessRequestPage}
        layout={AuthLayout}
      ></AppRoute>
      <AppRoute
        protected
        path="/mapView"
        component={MapView}
        layout={AuthLayout}
        claim={Claims.PROPERTY_VIEW}
      />
      <AppRoute
        protected
        path="/properties/list"
        component={PropertyListView}
        layout={AuthLayout}
        claim={Claims.PROPERTY_VIEW}
      />
      <AppRoute
        protected
        path="/submitProperty/:id?"
        component={SubmitProperty}
        layout={AuthLayout}
        claim={Claims.PROPERTY_ADD}
      />
      <AppRoute
        protected
        path="/admin/user/:id?"
        component={EditUserPage}
        layout={AuthLayout}
        claim={Claims.ADMIN_USERS}
      />
      <AppRoute path="*" component={() => <Redirect to="/page-not-found" />} />
    </Switch>
  );
};

export default AppRouter;
