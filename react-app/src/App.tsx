import { Routes, Route } from 'react-router-dom';
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

const Router = () => {
  return (
    <ConfigContextProvider>
      <AuthContextProvider>
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
          <Route path="admin">
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
          </Route>
        </Routes>
      </AuthContextProvider>
    </ConfigContextProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <Router />
    </ThemeProvider>
  );
};

export default App;
