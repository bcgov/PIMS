import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from '@/App.tsx';
import { KeycloakProvider } from '@bcgov/citz-imb-kc-react';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <KeycloakProvider>
        <Router />
      </KeycloakProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
