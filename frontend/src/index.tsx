import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import './index.scss'; // should be loaded last to allow for overrides without having to resort to "!important"
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-toastify/dist/ReactToastify.css';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import { AuthStateContextProvider } from 'contexts/authStateContext';
import { LoginLoading } from 'features/account';
import Keycloak from 'keycloak-js';
import { keycloakInstance } from 'keycloakInstance';
import EmptyLayout from 'layouts/EmptyLayout';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import getKeycloakEventHandler from 'utils/KeycloakEventHandler';

import css from './_variables.module.scss';
import App from './App';
import * as serviceWorker from './serviceWorker.ignore';
import { store } from './store';

/**
 * Displays LoginLoading until Keycloak connection is ready.
 * @returns Index component.
 */
const Index = () => {
  const [loading, setLoading] = React.useState(true);
  const [keycloak, setKeycloak] = React.useState(Keycloak);

  React.useEffect(() => {
    setKeycloak(keycloakInstance);
    setLoading(false);
  }, []);

  return loading ? (
    <EmptyLayout>
      <LoginLoading />
    </EmptyLayout>
  ) : (
    <ThemeProvider theme={{ css }}>
      <ReactKeycloakProvider
        authClient={keycloak}
        LoadingComponent={
          <EmptyLayout>
            <LoginLoading />
          </EmptyLayout>
        }
        onEvent={getKeycloakEventHandler(keycloak)}
        initOptions={{ pkceMethod: 'S256', onLoad: 'check-sso' }}
      >
        <Provider store={store}>
          <AuthStateContextProvider>
            <Router>
              <App />
            </Router>
          </AuthStateContextProvider>
        </Provider>
      </ReactKeycloakProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
