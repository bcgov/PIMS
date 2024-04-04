import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '@/pages/Home';
import React from 'react';
import '@/App.css';
import { ThemeProvider } from '@emotion/react';
import appTheme from './themes/appTheme';
import Dev from './pages/DevZone';
import { ConfigContextProvider } from './contexts/configContext';
import AuthContextProvider from './contexts/authContext';
import AuthRouteGuard from './guards/AuthRouteGuard';
import BaseLayout from './components/layout/BaseLayout';
import { AccessRequest } from './pages/AccessRequest';
import UsersManagement from './pages/UsersManagement';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/pages/ErrorFallback';
import UserDetail from '@/components/users/UserDetail';
import ActiveInventory from './pages/ActiveInventory';
import PropertyDetail from './components/property/PropertyDetail';
import AddProperty from './components/property/AddProperty';
import AgencyManagement from '@/pages/AgencyManagement';
import AgencyDetail from '@/components/agencies/AgencyDetails';
import AdminAreasManagement from './pages/AdminAreasManagement';
import AdministrativeAreaDetail from './components/adminAreas/AdministrativeAreaDetail';

const Router = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        index
        element={
          <BaseLayout displayFooter>
            <Home />
          </BaseLayout>
        }
      />
      <Route
        path="/access-request"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <AccessRequest />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="/dev"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <Dev />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route path="/admin">
        <Route
          path="adminAreas"
          element={
            <BaseLayout displayFooter>
              <AuthRouteGuard>
                <AdminAreasManagement />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="adminAreas/:id"
          element={
            <BaseLayout displayFooter>
              <AuthRouteGuard>
                <AdministrativeAreaDetail />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="agencies"
          element={
            <BaseLayout displayFooter>
              <AuthRouteGuard>
                <AgencyManagement />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="agencies/:id"
          element={
            <BaseLayout displayFooter>
              <AuthRouteGuard>
                <AgencyDetail onClose={() => navigate('/admin/agencies')} />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
      </Route>
      <Route
        path="properties"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <ActiveInventory />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="users"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <UsersManagement />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="properties/add"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <AddProperty />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="properties/building/:buildingId"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <PropertyDetail onClose={() => navigate('/properties/')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="properties/parcel/:parcelId"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <PropertyDetail onClose={() => navigate('/properties/')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route
        path="users/:id"
        element={
          <BaseLayout displayFooter>
            <AuthRouteGuard>
              <UserDetail onClose={() => navigate('/users')} />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ConfigContextProvider>
          <AuthContextProvider>
            <Router />
          </AuthContextProvider>
        </ConfigContextProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
