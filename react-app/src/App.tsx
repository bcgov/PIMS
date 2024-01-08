import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import React from 'react';
import '@/App.css';
import { ThemeProvider } from '@emotion/react';
import appTheme from './themes/appTheme';

const Router = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
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
