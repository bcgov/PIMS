import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import React from 'react';
import '@/App.css';
import { ThemeProvider } from '@emotion/react';
import appTheme from './themes/appTheme';
import Dev from './pages/DevZone';
import UsersTable from '@/pages/UsersTable';

const Router = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/dev" element={<Dev />} />
      <Route path="admin">
        <Route path="users" element={<UsersTable />} />
      </Route>
    </Routes>
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
