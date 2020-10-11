import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import './index.scss'; // should be loaded last to allow for overrides without having to resort to "!important"

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App, { store } from './App';
import * as serviceWorker from './serviceWorker.ignore';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { KeycloakProvider } from '@react-keycloak/web';
import { Spinner } from 'react-bootstrap';
import { Provider } from 'react-redux';
import getKeycloakEventHandler from 'utils/KeycloakEventHandler';
import { AuthStateContextProvider } from 'contexts/authStateContext';
import { BrowserRouter as Router } from 'react-router-dom';

//@ts-ignore
const keycloak: KeycloakInstance = new Keycloak('/keycloak.json');
const Index = () => {
  return (
    <KeycloakProvider
      keycloak={keycloak}
      LoadingComponent={<Spinner animation="border"></Spinner>}
      onEvent={getKeycloakEventHandler(keycloak)}
    >
      <Provider store={store}>
        <AuthStateContextProvider>
          <Router>
            <App />
          </Router>
        </AuthStateContextProvider>
      </Provider>
    </KeycloakProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
