import { ReactKeycloakProvider } from '@react-keycloak/web';
import FilterBackdrop from 'components/maps/leaflet/FilterBackdrop';
import { AppRouter } from 'components/router';
import { AuthStateContext, AuthStateContextProvider, IAuthState } from 'contexts/authStateContext';
import LoginLoading from 'features/account/LoginLoading';
import Keycloak from 'keycloak-js';
import EmptyLayout from 'layouts/EmptyLayout';
import PublicLayout from 'layouts/PublicLayout';
import OnLoadActions from 'OnLoadActions';
import React from 'react';
import { Col } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getActivateUserAction, getFetchLookupCodeAction } from 'store/slices/hooks';
import { createKeycloakInstance } from 'utils';
import getKeycloakEventHandler from 'utils/KeycloakEventHandler';

import { useAppDispatch } from './store';

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const [keycloak, setKeycloak] = React.useState(Keycloak);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    createKeycloakInstance()
      .then((instance) => {
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

  React.useEffect(() => {
    if (keycloak?.authenticated) {
      getActivateUserAction()(dispatch);
      getFetchLookupCodeAction()(dispatch);
    }
  }, [dispatch, keycloak]);

  return loading ? (
    <EmptyLayout>
      <LoginLoading />
    </EmptyLayout>
  ) : (
    <ReactKeycloakProvider
      authClient={keycloak}
      LoadingComponent={
        <EmptyLayout>
          <LoginLoading />
        </EmptyLayout>
      }
      onEvent={getKeycloakEventHandler(keycloak)}
    >
      <AuthStateContextProvider>
        <Router>
          <AuthStateContext.Consumer>
            {(context: IAuthState) => {
              if (!context.ready) {
                return (
                  <PublicLayout>
                    <Col>
                      <FilterBackdrop show={true}></FilterBackdrop>
                    </Col>
                  </PublicLayout>
                );
              }

              return (
                <>
                  <AppRouter />
                  <OnLoadActions />
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                  />
                </>
              );
            }}
          </AuthStateContext.Consumer>
        </Router>
      </AuthStateContextProvider>
    </ReactKeycloakProvider>
  );
};

export default App;
