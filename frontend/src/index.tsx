import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import './index.scss'; // should be loaded last to allow for overrides without having to resort to "!important"

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker.ignore';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { Provider } from 'react-redux';
import { AuthStateContextProvider } from 'contexts/authStateContext';
import { BrowserRouter as Router } from 'react-router-dom';
import EmptyLayout from 'layouts/EmptyLayout';
import LoginLoading from 'features/account/LoginLoading';
import Keycloak from 'keycloak-js';
import getKeycloakEventHandler from 'utils/KeycloakEventHandler';
import { store } from './store';
import { createKeycloakInstance } from 'utils';
import { ThemeProvider } from 'styled-components';

import css from './_variables.module.scss';

/**
 * Displays LoginLoading until Keycloak connection is ready.
 * @returns Index component.
 */
const Index = () => {
  const [loading, setLoading] = React.useState(true);
  const [keycloak, setKeycloak] = React.useState(Keycloak);

  React.useEffect(() => {
    createKeycloakInstance()
      .then(instance => {
        setKeycloak(instance);
        setLoading(false);
      })
      .catch(() => {
        // Ignore the error and apply the default config.
        //@ts-ignore
        setKeycloak(new Keycloak('./keycloak.json'));
        setLoading(false);
      });
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
