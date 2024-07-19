import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from '@/App.tsx';
import { SSOProvider } from '@bcgov/citz-imb-sso-react';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>,
);
