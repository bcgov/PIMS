import React, { useEffect } from 'react';
import './App.scss';
import { useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import configureStore from 'configureStore';
import { getActivateUserAction } from 'actionCreators/usersActionCreator';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { AuthStateContext, IAuthState } from 'contexts/authStateContext';
import AppRouter from 'router';

export const store = configureStore();

const App = () => {
  const keycloakWrapper = useKeycloakWrapper();
  const keycloak = keycloakWrapper.obj;
  const dispatch = useDispatch();

  useEffect(() => {
    if (keycloak?.authenticated) {
      dispatch(getActivateUserAction());
      dispatch(getFetchLookupCodeAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthStateContext.Consumer>
      {(context: IAuthState) => {
        if (!context.ready) {
          return <Spinner animation="border"></Spinner>;
        }

        return <AppRouter />;
      }}
    </AuthStateContext.Consumer>
  );
};

export default App;
