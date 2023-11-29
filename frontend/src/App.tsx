import './App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import FilterBackdrop from 'components/maps/leaflet/FilterBackdrop';
import { AuthStateContext, IAuthState } from 'contexts/authStateContext';
import { AppRouter } from 'features/routes';
import useKeycloakWrapper, { IKeycloak } from 'hooks/useKeycloakWrapper';
import Keycloak from 'keycloak-js';
import PublicLayout from 'layouts/PublicLayout';
import OnLoadActions from 'OnLoadActions';
import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch } from 'store';
import { getFetchLookupCodeAction } from 'store/slices/hooks/lookupCodeActionCreator';
import { fetchUserAgencies, getActivateUserAction } from 'store/slices/hooks/usersActionCreator';

const App = () => {
  const keycloakWrapper: IKeycloak = useKeycloakWrapper();
  const keycloak: Keycloak = keycloakWrapper.obj;
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // Track page view in Snowplow Analytics.
    // @ts-ignore
    window.snowplow('trackPageView');
  }, [location.pathname]);

  useEffect(() => {
    if (keycloak?.authenticated) {
      getActivateUserAction()(dispatch).then(() => {
        //TODO: Modify the "/activate" endpoint to return user agencies as well, thus removing the need for this call
        fetchUserAgencies({ username: keycloakWrapper.username })(dispatch);
      });
      getFetchLookupCodeAction()(dispatch);
    }
  }, [dispatch, keycloak]);

  return (
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
  );
};

export default App;
