import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { KeycloakProvider } from '@react-keycloak/web';
import { Spinner } from 'react-bootstrap';

//@ts-ignore
const keycloak:KeycloakInstance = new Keycloak('keycloak.json');
const Index = () => {
    return <KeycloakProvider
        keycloak={keycloak}
        LoadingComponent={<Spinner animation="border"></Spinner>}>
        <App />
    </KeycloakProvider>;
};

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
