import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import React from 'react';
import '@/App.css';
import { ThemeProvider } from '@emotion/react';
import appTheme from './themes/appTheme';
import Dev from './pages/DevZone';
import { ConfigContextProvider } from './contexts/configContext';

const Router = () => {
  return (
    <ConfigContextProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
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
