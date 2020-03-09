import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App, { store } from './App';
import * as serviceWorker from './serviceWorker';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { KeycloakProvider } from '@react-keycloak/web';
import { Spinner } from 'react-bootstrap';
import { Provider } from 'react-redux';
import getKeycloakEventHandler from 'utils/KeycloakEventHandler';

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
        <App />
      </Provider>
    </KeycloakProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
