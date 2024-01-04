import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import React from 'react';
import '@/App.css';
import { Login } from '@/pages/Login';

const App = () => {
  const { isAuthenticated } = useKeycloak();

  return isAuthenticated ? (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  ) : (
    <Login />
  );
};

export default App;
