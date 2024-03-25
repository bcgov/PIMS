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
import AgencyManagement from '@/pages/AgencyManagement';

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
          <BaseLayout>
            <AuthRouteGuard>
              <Dev />
            </AuthRouteGuard>
          </BaseLayout>
        }
      />
      <Route path="/admin">
        <Route
          path="agencies"
          element={
            <BaseLayout>
              <AuthRouteGuard>
                <AgencyManagement />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="users"
          element={
            <BaseLayout>
              <AuthRouteGuard>
                <UsersManagement />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
        <Route
          path="users/:id"
          element={
            <BaseLayout>
              <AuthRouteGuard>
                <UserDetail onClose={() => navigate('/admin/users')} />
              </AuthRouteGuard>
            </BaseLayout>
          }
        />
      </Route>
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
