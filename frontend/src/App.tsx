import './App.scss';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import configureStore from 'configureStore';
import { getActivateUserAction } from 'actionCreators/usersActionCreator';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { AuthStateContext, IAuthState } from 'contexts/authStateContext';
import AppRouter from 'router';
import OnLoadActions from 'OnLoadActions';

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
  }, [dispatch, keycloak]);

  return (
    <AuthStateContext.Consumer>
      {(context: IAuthState) => {
        if (!context.ready) {
          return <Spinner animation="border"></Spinner>;
        }

        return (
          <>
            <AppRouter />
            <OnLoadActions />
          </>
        );
      }}
    </AuthStateContext.Consumer>
  );
};

export default App;
