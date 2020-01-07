import { Redirect } from 'react-router-dom';
import { useKeycloak } from 'react-keycloak';
import React from 'react';
import './Login.scss';

function Login() {
  const { keycloak } = useKeycloak();

  if (keycloak.authenticated) {
    return <Redirect to={{ pathname: '/mapview' }} />;
  }

  return (
    <div className="unauth">
      <h1>Welcome! Connect to Start</h1>
      <div>
        <span>
          <a className="button" onClick={() => keycloak.login()}>
            Sign-in
            </a>
        </span>
      </div>
    </div>
  );
}

export default Login;
